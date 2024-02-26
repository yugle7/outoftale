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

async function loadChat(pb, profile_id, problem, type) {
    const { title } = problem;
    let chat;

    let id = type === 6 ? profile_id : String(type).repeat(15);
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
    const profile = pb.authStore.model;

    const type = +url.searchParams.get('type');
    if (!types.includes(type)) return {};

    const { problem } = await parent();
    const chat = await loadChat(pb, profile.id, problem, type)

    if (!profile) return { chat };

    const talk = await loadTalk(pb, profile.id, chat.id);
    return { chat, talk }
}

const sendMessage = async (pb, solution, step) => {
    if (!step) await createTalk(pb, solution);
    updateTalk(pb, solution);
}

const createTalk = async (pb, solution) => {
    const { id, problem, author_id } = solution;
    const { title } = problem;

    try {
        await pb.collection('chats').create({
            id,
            type: 6,
            title
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

        const data = await request.formData();
        const action = data.get('action');

        const problem_id = params.id;

        let problem = {
            title: data.get('title'),
            condition: data.get('condition'),
            notes: data.get('notes') || null,
            categories: data.getAll('categories'),
            answer: data.get('answer') || null,
            proof: data.get('proof') || null,
            changed: new Date()
        }
        const draft = {
            ...problem,
            problem_id,
            editor_id: profile.id,
            editor: getAuthor(profile)
        }

        let res = await pb.collection('problems').getOne(problem_id);

        if (action === 'update') {
            await pb.collection('problems').update(problem_id, problem);
            draft.applied = true;
        }
        problem = getDraft(res);

        res = await pb.collection('drafts').create(draft);

        await pb.collection('edits').create({
            profile_id: profile.id,
            draft_id: res.id,
            draft: getDraft(res),
            problem_id,
            problem,
            action
        });

        if (action === 'create') redirect(303, `/drafts/${res.id}`);
    },
    progress: async ({ request, params, locals }) => {
        const pb = locals.pb;
        const profile = pb.authStore.model;

        const problem_id = params.id;
        const id = addId(profile.id, problem_id);

        let res = await pb.collection('solutions').getOne(id);
        const { author_id, problem, progress, step } = res;

        const data = await request.formData();

        const solution = {
            progress: +data.get('progress'),
            'step+': (progress === 0 || progress === 3 || progress === 4) - (progress === 5),
            changed: new Date()
        };
        const answer = data.get('answer');
        if (answer != null) solution.answer = answer;

        const proof = data.get('proof');
        if (proof != null) solution.proof = proof;

        res = await pb.collection('solutions').update(id, solution);
        const actions = [];

        if (res.progress !== progress) {
            actions.push(sendMessage(pb, res, step));

            if (!step) {
                actions.push(pb.collection('users').update(profile.id, { 'solutions+': 1 }));
                actions.push(pb.collection('problems').update(problem_id, { 'solutions+': 1 }));
            }
        }

        if (progress === 5 && res.progress !== 5 && problem.weight > 0) {
            res = await pb.collection('users').update(author_id, { 'rating-': problem.weight });

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

        await pb.collection('problems').update(params.id, { status: +data.get('status') });
    }
}