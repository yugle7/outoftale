import { redirect } from '@sveltejs/kit';

async function loadChats(pb, profile) {
    const res = await pb.collection('talks').getFullList({
        filter: `profile_id="${profile.id}"&&deleted!=true`,
        expand: 'chat_id'
    });
    return res.map((talk) => {
        return { ...talk.expand.chat_id, talk };
    });
}

export async function load({ locals }) {
    const pb = locals.pb;
    
    const profile = pb.authStore.model;
    if (!profile) throw redirect('/login');

    return {
        chats: loadChats(pb, profile),
        profile
    };
}
