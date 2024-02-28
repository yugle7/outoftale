import { addId, getAuthor, getSolution } from "$lib";
import { solution_progress } from "../data";

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

async function loadChat(pb, solution, problem) {
    const { id } = solution;
    let chat;

    try {
        chat = await pb.collection('chats').getOne(id);
        chat.messages = await loadMessages(pb, id);
    } catch (err) {
        console.log(err.message);

        chat = await pb.collection('chats').create({
            id,
            title: problem.title,
            type: 7,
            changed: new Date()
        });
        chat.messages = [];
    }
    return chat;
}

async function sendMessage(pb, profile, solution, progress) {
    const author = getAuthor(profile);
    const text = solution_progress[progress];

    try {
        let res = await pb.collection('messages').create({
            text,
            author_id: profile.id,
            author,
            chat_id: solution.id
        });

        res = await pb.collection('chats').update(solution.id, {
            sender_id: profile.id,
            message: { text, author, message_id: res.id },
            'sent+': 1,
            changed: res.updated
        });

        const id = addId(solution.id, profile.id);
        try {
            await pb.collection('talks').update(id, { deleted: false, read: res.sent });
        } catch (err) {
            console.log(err.message);
            await pb.collection('talks').create({ id, read: res.sent })
        }

    } catch (err) {
        console.log(err.message);
    }
}

export async function load({ parent, url, locals }) {
    const pb = locals.pb;
    const profile = pb.authStore.model;

    if (!profile) throw redirect('/login');
    if (url.searchParams.get('type') !== '7') return {};

    const { solution, problem } = await parent();
    if (!solution || !problem) return {};

    const chat = await loadChat(pb, solution, problem)
    const talk = await loadTalk(pb, profile.id, chat.id);

    return { chat, talk }
}

export const actions = {
    progress: async ({ request, locals }) => {
        const pb = locals.pb;
        const profile = pb.authStore.model;

        if (!profile) throw redirect('/login');

        const data = await request.formData();

        const progress = +data.get('progress');
        const weight = +data.get('weight');

        const id = data.get('id');
        const solution = await pb.collection('solutions').getOne(id);
        const { author_id } = solution;

        const actions = [
            pb.collection('reviews').create({
                solution_id: id,
                reviewer_id: profile.id,
                progress,
                solution: getSolution(solution)
            }),
            sendMessage(pb, profile, solution, progress),
            pb.collection('solutions').update(id, {
                'step+': +(solution.progress >= 3 && solution.step % 2),
                solution: getSolution(solution),
                progress
            })
        ];

        if (weight) {
            let res;
            const user = {};

            if (progress === 5 && solution.progress !== 5) {
                res = await pb.collection('users').update(author_id, { 'rating+': weight });
                if (res.role === 0 && res.rating > 5) user.role = 1;

                for (let i = 1; i <= weight; i++) {
                    const id = String(res.rating - i).padStart(15, '0');
                    actions.push(pb.collection('positions').update(id, { 'users+': 1 }));
                }
            } else if (progress !== 5 && solution.progress === 5) {
                res = await pb.collection('users').update(author_id, { 'rating-': weight });

                for (let i = 1; i <= weight; i++) {
                    const id = String(res.rating + i).padStart(15, '0');
                    actions.push(pb.collection('positions').update(id, { 'users-': 1 }));
                }
            }
            if (res) {
                const id = String(res.rating).padStart(15, '0');

                res = await pb.collection('positions').getOne(id);
                user.position = res.users;

                actions.push(pb.collection('users').update(author_id, user));
            }
        }
        await Promise.all(actions);
    },
    review: async ({ params, locals }) => {
        const pb = locals.pb;
        const profile = pb.authStore.model;

        if (!profile) throw redirect('/login');

        const solution_id = params.id;
        const solution = await pb.collection('solutions').getOne(solution_id);

        let actions;
        if (solution.reviewer_id !== profile.id) {
            const progress = 3;

            const reviewer = getAuthor(profile);
            const reviewer_id = profile.id;

            actions = [
                pb.collection('reviews').create({
                    solution_id,
                    reviewer_id,
                    progress,
                    solution: getSolution(solution)
                }),
                sendMessage(pb, profile, solution, progress),
                pb.collection('solutions').update(solution_id, {
                    reviewer,
                    reviewer_id,
                    progress
                })
            ];
        } else {
            const progress = Math.min(2, solution.progress);

            actions = [
                pb.collection('reviews').create({
                    solution_id,
                    reviewer_id: solution.reviewer_id,
                    progress,
                    solution: getSolution(solution)
                }),
                pb.collection('solutions').update(solution_id, {
                    reviewer: null,
                    reviewer_id: null,
                    progress
                })
            ];
        }
        await Promise.all(actions);
    }
}