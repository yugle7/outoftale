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

    if (profile) {
        const reacts = await loadReacts(pb, profile);
        if (reacts) drafts.forEach(d => (d.react = reacts[d.id]));
    }
    return drafts;
}

export async function load({ locals, url }) {
    const pb = locals.pb;
    const profile = pb.authStore.model;

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
