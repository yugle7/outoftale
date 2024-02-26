import { addId } from "$lib";
import { default_params } from './data';

async function loadReacts(pb, profile) {
    const res = await pb.collection('thoughts').getFullList({
        filter: `profile_id="${profile.id}"`
    });
    if (res.length > 0) {
        const reacts = {};
        res.forEach(t => (reacts[t.discussion_id] = t.react));
        return reacts;
    }
}

async function loadDiscussions(pb, profile, params) {
    const { topic, sort, author_id } = params;

    const filters = [];

    if (topic != null) filters.push(`topic=${topic}`);
    if (author_id != null) filters.push(`author_id="${author_id}"`);

    let discussions;

    if (filters.length > 0) {
        discussions = await pb.collection('discussions').getFullList({
            filter: filters.join('&&'),
            sort
        });
    } else {
        const res = await pb.collection('discussions').getList(1, 1000, { sort });
        discussions = res.items;
    }
    if (profile) {
        const reacts = await loadReacts(pb, profile);
        if (reacts) {
            discussions.forEach((d) => (d.react = reacts[d.id]));
        }
    }
    return discussions;
}

export async function load({ locals, url }) {
    const pb = locals.pb;
    const profile = pb.authStore.model;

    const params = { ...default_params };
    for (const key of ['sort', 'topic', 'author_id']) params[key] = url.searchParams.get(key) ?? params[key];

    return {
        discussions: loadDiscussions(pb, profile, params),
        profile,
        params
    };
}

export const actions = {
    react: async ({ request, locals }) => {
        const pb = locals.pb;
        const profile = pb.authStore.model;

        const data = await request.formData();

        const discussion_id = data.get('discussion_id');
        const react = data.get('react');

        const id = addId(profile.id, discussion_id);

        try {
            const res = await pb.collection('thoughts').getOne(id);

            if (res.react === react) return;
            await pb.collection('thoughts').update(id, { react });

            const data = {};
            if (res.react > 0) data[res.react + '-'] = 1;
            if (react > 0) data[react + '+'] = 1;

            await pb.collection('discussions').update(discussion_id, data);

        } catch (err) {
            console.log(err.message);

            const data = {};
            data[react + '+'] = 1;

            await pb.collection('discussions').update(discussion_id, data);

            await pb.collection('thoughts').create({
                id,
                react,
                profile_id: profile.id,
                discussion_id
            });
        }
    }
}