import { addId } from "$lib";
import { error, redirect } from "@sveltejs/kit";

async function loadRect(pb, profile, draft) {
    const id = addId(draft.id, profile.id);
    try {
        const res = await pb.collection('applies').getOne(id);
        return res.react;
    } catch (err) {
        console.log(err.message);
    }
}

async function loadDraft(pb, id) {
    try {
        return await pb.collection('drafts').getOne(id, { expand: 'problem_id' });
    } catch (err) {
        console.log(err.message);
        error(404, 'нет такой правки')
    }
}

export async function load({ params, locals }) {
    const pb = locals.pb;
    
    const profile = pb.authStore.model;
    if (!profile) throw redirect('/login');

    const draft = await loadDraft(pb, params.id);
    draft.react = await loadRect(pb, profile, draft)

    const problem = draft.expand.problem_id;
    delete draft.expand;

    return {
        draft,
        problem,
        profile
    };
}
