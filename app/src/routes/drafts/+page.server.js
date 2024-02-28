import { addId } from '$lib';
import { redirect } from '@sveltejs/kit';
import { default_params } from './data';

async function loadReacts(pb, profile) {
    const res = await pb.collection('applies').getFullList({
        filter: `profile_id="${profile.id}"`
    });
    if (res.length) {
        const reacts = {};
        res.forEach(({ draft_id, react }) => (reacts[draft_id] = react));
        return reacts;
    }
}

async function loadDrafts(pb, profile, params) {
    const { sort, category, editor_id, problem_id, applied } = params;

    const filters = ['deleted=false', `applied=${Boolean(applied)}`];

    if (category != null) filters.push(`categories~${category}`);
    if (editor_id) filters.push(`editor_id="${editor_id}"`);
    if (problem_id) filters.push(`problem_id="${problem_id}"`);

    const res = await pb.collection('drafts').getList(1, 1000, {
        filter: filters.join('&&'),
        sort
    });
    const drafts = res.items;

    const reacts = await loadReacts(pb, profile);
    if (reacts) drafts.forEach(d => (d.react = reacts[d.id]));
    
    return drafts;
}

export async function load({ locals, url }) {
    const pb = locals.pb;
    
    const profile = pb.authStore.model;
    if (!profile) throw redirect('/login');

    const params = { ...default_params };
    for (const key of ['sort', 'category', 'editor_id', 'problem_id']) {
        params[key] = url.searchParams.get(key) || params[key];
    }
    const applied = url.searchParams.get('applied');
    if (applied) params.applied = +applied;

    return {
        drafts: loadDrafts(pb, profile, params),
        profile,
        params
    };
}

export const actions = {
    react: async ({ request, locals }) => {
        const pb = locals.pb;
        const profile = pb.authStore.model;

        const form = await request.formData();

        const draft_id = form.get('draft_id');
        const react = form.get('react');

        const id = addId(profile.id, draft_id);
        const data = {};

        try {
            const res = await pb.collection('applies').getOne(id);

            if (res.react === react) return;
            await pb.collection('applies').update(id, { react });

            if (res.react > 0) data[res.react + '-'] = 1;
            if (react > 0) data[react + '+'] = 1;

            await pb.collection('drafts').update(draft_id, data);

        } catch (err) {
            console.log(err.message);

            data[react + '+'] = 1;
            await pb.collection('drafts').update(draft_id, data);

            await pb.collection('applies').create({
                id,
                react,
                profile_id: profile.id,
                draft_id
            });
        }

    }
}