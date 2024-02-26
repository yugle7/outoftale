import { addId, getAuthor } from '$lib';

function parseUsernames(text) {
    return text.match(/(^|\s)@[a-z]{3,}\b/g)?.map((u) => u.substr(u[0] === '@' ? 1 : 2)) || [];
}

async function getUsers(pb, text) {
    const usernames = parseUsernames(text);
    if (!usernames.length) return [];

    const filter = usernames.map((u) => `username="${u}"`).join('||');
    return await pb.collection('users').getFullList({ filter });
}

async function updateTalks(pb, profile, message) {
    const { text, reply, chat_id } = message;

    const users = await getUsers(pb, text);

    if (reply) {
        const { author_id } = reply;
        if (author_id !== profile.id) users.push({ id: author_id });
    }
    console.log(users);
    Promise.all(
        users.map(({ id }) => {
            id = addId(id, chat_id);
            try {
                return pb.collection('talks').update(id, { message_id: message.id });
            } catch (err) {
                console.log(err.message);
            }
        })
    );
}

async function createMessage(pb, profile, message) {
    const author_id = profile.id;
    const author = getAuthor(profile);

    const { id, chat_id, text, created } = await pb.collection('messages').create({
        ...message,
        author_id,
        author
    });
    message.id = id;

    const { updated, sent, type } = await pb.collection('chats').update(chat_id, {
        message: { text, author },
        message_id: id,
        sender_id: author_id,
        changed: created,
        'sent+': 1
    });

    const talk_id = addId(author_id, chat_id);
    const { user_id } = await pb.collection('talks').update(talk_id, { read: sent });

    if (user_id && sent === 1) {
        const talk_id = addId(user_id, chat_id);
        try {
            await pb.collection('talks').create(talk_id, {
                profile_id: user_id,
                chat_id,
                user_id: author_id,
                user: author
            });
        } catch (err) {
            console.log(err.message);
        }
    }
    if (type === 1) {
        await pb.collection('discussions').update(chat_id, { messages: sent, changed: updated });
    }
}
async function updateMessage(pb, message) {
    const { id, text, chat_id, author } = message;
    const { updated } = await pb.collection('messages').update(id, { text });

    await pb.collection('chats').update(chat_id, {
        message: { text, author },
        changed: updated
    });
}

async function editMessage(pb, profile, message) {
    const { id, text, reply, chat_id, author } = message;
    const { updated } = await pb.collection('messages').update(id, { text, reply });

    const { message_id } = await pb.collection('chats').getOne(chat_id);

    if (message_id === id) {
        await pb.collection('chats').update(chat_id, {
            message: { text, author },
            reply,
            changed: updated
        });
        await updateTalks(profile, message);
    }
}

export const actions = {
    delete: async ({ request, locals }) => {
        const pb = locals.pb;

        const data = await request.formData();
        
        const message_id = data.get('message_id');
        const deleted = data.get('deleted') === 'true';

        try {
            await pb.collection('messages').update(message_id, { deleted });

        } catch (err) {
            console.log(err.message);
        }
    },
    send: async ({ request, locals }) => {
        const pb = locals.pb;
        const profile = pb.authStore.model;

        const data = await request.formData();

        const message = JSON.parse(data.get('message'));
        const edited = data.get('edited') === 'true';

        console.log(message);

        if (edited) {
            await editMessage(pb, profile, message);
        } else {
            if (message.id) {
                console.log('updateMessage');
                await updateMessage(pb, message);
            } else {
                console.log('createMessage');
                await createMessage(pb, profile, message);
            }
            await updateTalks(pb, profile, message);
        }
    },
    react: async ({ request, locals }) => {
        const pb = locals.pb;
        const profile = pb.authStore.model;

        const data = await request.formData();
        console.log(data);

        const message_id = data.get('message_id');
        const react = data.get('react');

        const id = addId(profile.id, message_id);

        try {
            const res = await pb.collection('reacts').getOne(id);

            if (res.react === react) return;
            await pb.collection('reacts').update(id, { react });

            const data = {};
            if (res.react > 0) data[res.react + '-'] = 1;
            if (react > 0) data[react + '+'] = 1;

            await pb.collection('messages').update(message_id, data);

        } catch (err) {
            console.log(err.message);

            const data = {};
            data[react + '+'] = 1;

            const res = await pb.collection('messages').update(message_id, data);

            const { chat_id } = res;
            const talk_id = addId(chat_id, profile.id);

            await pb.collection('reacts').create({
                id,
                react,
                profile_id: profile.id,
                message_id,
                talk_id,
                chat_id
            });
        }
    }
}