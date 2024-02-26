import { addId } from "$lib";
import { getDraft } from "$lib";

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

async function loadChat(pb, draft, type) {
    const { id, title } = draft;
    let chat;

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

export async function load({ parent, url, locals }) {
    const pb = locals.pb;
    const profile = pb.authStore.model;

    const type = +url.searchParams.get('type');
    if (type !== 8) return {};

    const { draft } = await parent();
    const chat = await loadChat(pb, draft, type)

    if (!profile) return { chat };

    const talk = await loadTalk(pb, profile.id, chat.id);
    return { chat, talk }
}


export const actions = {
    edit: async ({ request, params, locals }) => {
        const pb = locals.pb;
        const profile = pb.authStore.model;

        const draft_id = params.id;
        const applied = false;

        const data = await request.formData();
        const categories = data.getAll('categories');

        const draft = {
            title: data.get('title'),
            condition: data.get('condition'),
            notes: data.get('notes'),
            answer: data.get('answer'),
            proof: data.get('proof'),
            editor_id: profile.id,
            changed: new Date()
        }
        if (categories.length > 0) draft.categories = categories;

        const res = await pb.collection('drafts').update(draft_id, { ...draft, applied });
        const { problem_id, problem } = res;

        await pb.collection('edits').create({
            profile_id: profile.id,
            draft_id,
            draft,
            problem_id,
            problem,
            action: 'edit'
        });
    },
    apply: async ({ request, params, locals }) => {
        const pb = locals.pb;
        const profile = pb.authStore.model;

        const draft_id = params.id;

        const data = await request.formData();
        const problem_id = data.get('problem_id');

        let res = await pb.collection('problems').getOne(problem_id);
        const problem = getDraft(res);

        res = await pb.collection('drafts').update(draft_id, {
            problem,
            applied: true,
            changed: new Date()
        });
        const draft = getDraft(res);

        await pb.collection('problems').update(problem_id, draft);

        await pb.collection('edits').create({
            profile_id: profile.id,
            draft_id,
            draft,
            problem_id,
            problem,
            action: 'apply'
        });
    },
    cancel: async ({ params, locals }) => {
        const pb = locals.pb;
        const profile = pb.authStore.model;

        const draft_id = params.id;

        const res = await pb.collection('drafts').update(draft_id, { applied: false });
        const { problem_id, problem, changed } = res;

        if (problem) {
            const res = await pb.collection('problems').getOne(problem_id);
            if (res.changed === changed) {
                await pb.collection('problems').update(problem_id, problem);
            }
        }
        await pb.collection('edits').create({
            profile_id: profile.id,
            draft_id,
            draft: getDraft(res),
            problem_id,
            problem,
            action: 'cancel'
        });
    },
    delete: async ({ params, locals }) => {
        const pb = locals.pb;
        const profile = pb.authStore.model;

        const deleted = true;
        const draft_id = params.id;

        const res = await pb.collection('drafts').update(draft_id, { deleted });
        const { problem_id, problem } = res;

        await pb.collection('edits').create({
            profile_id: profile.id,
            draft_id,
            draft: getDraft(res),
            problem_id,
            problem,
            action: 'delete'
        });
    },
    restore: async ({ params, locals }) => {
        const pb = locals.pb;
        const profile = pb.authStore.model;

        const deleted = false;
        const draft_id = params.id;

        const res = await pb.collection('drafts').update(draft_id, { deleted });
        const { problem_id, problem } = res;

        await pb.collection('edits').create({
            profile_id: profile.id,
            draft_id,
            draft: getDraft(res),
            problem_id,
            problem,
            action: 'restore'
        });
    },
}