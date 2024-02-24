import { subId } from "$lib";
import { error } from "@sveltejs/kit";


async function isFriend(pb, profile, user) {
    const id = subId(profile.id, user.id);
    try {
        await pb.collection('friends').getOne(id);
        user.friend = true;
    } catch (err) {
        console.log(err.message);
    }
}

async function loadUser(pb, profile, username) {
    try {
        const user = await pb.collection('users').getFirstListItem(`username="${username}"`);
        if (profile) await isFriend(pb, profile, user);
        
        return user;
    } catch (err) {
        console.log(err.message);
        error(404, `пользователь ${username} не найден`)
    }
}

export async function load({ params, locals }) {
    const pb = locals.pb;
    const profile = pb.authStore.model;

    if (profile?.username === params.username) return { profile };

    return {
        user: await loadUser(pb, profile, params.username),
        profile
    };
}

