import { addId, subId, getAuthor } from "$lib";

async function loadReacts(pb, talk) {
    const res = await pb.collection('reacts').getFullList({
        filter: `talk_id="${talk.id}"`
    });
    const reacts = {};
    res.forEach((r) => (reacts[r.message_id] = r.react));
    return reacts;
}

async function loadTalk(pb, profile, user, chat) {
    const id = addId(profile.id, chat.id);
    let talk;

    try {
        talk = await pb.collection('talks').getOne(id);
        talk.reacts = await loadReacts(pb, talk);
    } catch (err) {
        console.log(err.message);

        talk = await pb.collection('talks').create({
            id,
            profile_id: profile.id,
            chat_id: chat.id,
            user: getAuthor(user),
            user_id: user.id
        });
        talk.reacts = {};
    }
    return talk;
}

async function loadMessages(pb, chat) {
    return await pb.collection('messages').getFullList({
        filter: `chat_id="${chat.id}"`,
        sort: 'created'
    });
}
async function loadChat(pb, profile, user) {
    const id = addId(profile.id, user.id);
    let chat;

    try {
        chat = await pb.collection('chats').getOne(id);
        chat.messages = await loadMessages(pb, chat);
    } catch (err) {
        console.log(err.message);

        chat = await pb.collection('chats').create({
            id,
            type: 0,
            changed: new Date()
        });
        chat.messages = [];
    }
    return chat;
}

export async function load({ parent, url, locals }) {
    const type = url.searchParams.get('type');
    if (type !== '0') return {};

    const pb = locals.pb;
    const profile = pb.authStore.model;
    if (!profile) return {};

    const { user } = await parent();
    const chat = await loadChat(pb, profile, user);
    const talk = await loadTalk(pb, profile, user, chat);

    return { chat, talk };
}

export const actions = {
    logout: async ({ locals }) => {
        locals.pb.authStore.clear();
    },
    friend: async ({ request, locals }) => {
        const pb = locals.pb;
        const profile = pb.authStore.model;

        const data = await request.formData();

        const friend = data.get('friend') === 'true';
        const user_id = data.get('user_id');

        const id = subId(profile.id, user_id);
        try {
            if (friend) {
                await pb.collection('friends').create({ id, profile_id: profile.id, user_id });
                await pb.collection('users').update(profile.id, { 'friends+': 1 });
            } else {
                await pb.collection('friends').delete(id);
                await pb.collection('users').update(profile.id, { 'friends-': 1 });
            }
        } catch (err) {
            console.log(err.message);
        }
    },
    email_visibility: async ({ request, locals }) => {
        const pb = locals.pb;
        const profile = pb.authStore.model;

        const data = await request.formData();

        const emailVisibility = data.get('email_visibility') === 'false';
        await pb.collection('users').update(profile.id, { emailVisibility });
    },
    role: async ({ request, locals }) => {
        const pb = locals.pb;

        const data = await request.formData();
        const role = +data.get('role');

        await pb.collection('users').update(data.get('user_id'), { role, wanted: null });
    },
    wanted: async ({ request, locals }) => {
        const pb = locals.pb;
        const profile = pb.authStore.model;

        const data = await request.formData();
        const role = +data.get('to');

        let user;

        if (!role) {
            user = { wanted: null };
        } else if (role > profile.to) {
            user = { wanted: new Date() };
        } else {
            user = { role };
        }
        await pb.collection('users').update(profile.id, user);
    }
}