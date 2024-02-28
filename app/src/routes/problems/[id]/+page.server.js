import { redirect } from '@sveltejs/kit';

import { addId, getAuthor, getDraft } from "$lib";
import { solution_progress } from "../../solutions/data";

async function loadReacts(pb, talk_id) {
    const res = await pb.collection('reacts').getFullList({
        filter: `talk_id="${talk_id}"`
    });
    const reacts = {};
    res.forEach((r) => (reacts[r.message_id] = r.react));
    return reacts;
}

async function loadTalk(pb, profile_id, chat_id) {
    const id = addId(profile_id, chat_id);
    let talk;

    try {
        talk = await pb.collection('talks').getOne(id);
        if (talk.message_id) await pb.collection('talks').update(id, { message_id: null });
        talk.reacts = await loadReacts(pb, id);
    } catch (err) {
        console.log(err.message);

        talk = await pb.collection('talks').create({
            id,
            profile_id,
            chat_id,
            deleted: true
        });
        talk.reacts = {};
    }
    return talk;
}

async function loadMessages(pb, chat_id) {
    return await pb.collection('messages').getFullList({
        filter: `chat_id="${chat_id}"`,
        sort: 'created'
    });
}

async function loadChat(pb, profile, problem, type) {
    const { title } = problem;
    let chat;

    let id = type === 6 ? profile.id : String(type).repeat(15);
    id = addId(problem.id, id);

    try {
        chat = await pb.collection('chats').getOne(id);
        chat.messages = await loadMessages(pb, id);
    } catch (err) {
        console.log(err.message);

        chat = await pb.collection('chats').create({
            id,
            title,
            type,
            changed: new Date()
        });
        chat.messages = [];
    }
    return chat;
}

const types = [2, 3, 4, 5, 6];

export async function load({ parent, url, locals }) {
    const pb = locals.pb;

    const type = +url.searchParams.get('type');
    if (!types.includes(type)) return {};

    const profile = pb.authStore.model;
    if (type === 6 && !profile) return {};

    const { problem } = await parent();
    if (!problem) return {};

    const chat = await loadChat(pb, profile, problem, type)
    if (!profile) return { chat };

    const talk = await loadTalk(pb, profile.id, chat.id);
    return { chat, talk }
}

const sendMessage = async (pb, problem, solution, step) => {
    if (!step) await createTalk(pb, problem, solution);
    updateTalk(pb, solution);
}

const createTalk = async (pb, problem, solution) => {
    const { id, author_id } = solution;

    try {
        await pb.collection('chats').create({
            id,
            type: 6,
            title: problem.title
        });
    } catch (err) {
        console.log(err.message);
    }
    try {
        await pb.collection('talks').create({
            id: addId(author_id, id),
            chat_id: id,
            profile_id: author_id
        });
    } catch (err) {
        console.log(err.message);
    }
};

const updateTalk = async (pb, solution) => {
    const { author_id, author, progress } = solution;
    const text = solution_progress[progress];

    try {
        let res = await pb.collection('messages').create({
            text,
            author_id,
            author,
            chat_id: solution.id
        });

        res = await pb.collection('chats').update(solution.id, {
            'sent+': 1,
            sender_id: author_id,
            message: { text, author, message_id: res.id },
            changed: res.updated
        });

        const id = addId(author_id, solution.id);
        await pb.collection('talks').update(id, {
            read: res.sent,
            deleted: false
        });

    } catch (err) {
        console.log(err.message);
    }
};

export const actions = {
    edit: async ({ request, params, locals }) => {
        const pb = locals.pb;
        const profile = pb.authStore.model;

        const problem_id = params.id;
        const data = await request.formData();

        const categories = data.getAll('categories');
        if (categories.length === 0) return;

        const action = data.get('action');
        const applied = action === 'update';

        const problem = {
            title: data.get('title'),
            condition: data.get('condition'),
            categories,
            notes: data.get('notes') || null,
            answer: data.get('answer') || null,
            proof: data.get('proof') || null,
            changed: new Date()
        }

        const draft = {
            ...problem,
            problem_id,
            editor_id: profile.id,
            editor: getAuthor(profile),
            applied
        }
        const { id } = await pb.collection('drafts').create(draft);
        const res = await pb.collection('problems').getOne(problem_id);

        try {
            await pb.collection('edits').create({
                profile_id: profile.id,
                action,
                draft_id: id,
                draft: getDraft(draft),
                problem_id,
                problem: getDraft(res)
            });
        } catch (err) {
            console.log(err.message);
        }
        if (applied) {
            await pb.collection('problems').update(problem_id, problem);
        } else {
            await pb.collection('problems').update(problem_id, { 'drafts+': 1 });
            await pb.collection('users').update(profile.id, { 'drafts+': 1 });
            
            redirect(303, `/drafts/${id}`);
        }
    },
    progress: async ({ request, params, locals }) => {
        const pb = locals.pb;
        const profile = pb.authStore.model;

        const problem = await pb.collection('problems').getOne(params.id);

        const id = addId(profile.id, problem.id);
        const { author_id, progress, step } = await pb.collection('solutions').getOne(id);

        const data = await request.formData();

        let solution = {
            progress: +data.get('progress'),
            'step+': (progress === 0 || progress === 3 || progress === 4) - (progress === 5),
            changed: new Date()
        };
        const answer = data.get('answer');
        if (answer != null) solution.answer = answer;

        const proof = data.get('proof');
        if (proof != null) solution.proof = proof;

        solution = await pb.collection('solutions').update(id, solution);
        const actions = [];

        if (solution.progress !== progress) {
            actions.push(sendMessage(pb, problem, solution, step));

            if (!step) {
                actions.push(pb.collection('users').update(profile.id, { 'solutions+': 1 }));
                actions.push(pb.collection('problems').update(problem.id, { 'solutions+': 1 }));
            }
        }

        if (progress === 5 && solution.progress !== 5 && problem.weight > 0) {
            const res = await pb.collection('users').update(author_id, { 'rating-': problem.weight });

            for (let i = 1; i <= problem.weight; i++) {
                const id = String(res.rating + i).padStart(15, '0');
                actions.push(pb.collection('positions').update(id, { 'users-': 1 }));
            }
        }
        await Promise.all(actions);
    },
    status: async ({ request, params, locals }) => {
        const pb = locals.pb;

        const data = await request.formData();
        const status = +data.get('status');

        await pb.collection('problems').update(params.id, { status });
    }
}