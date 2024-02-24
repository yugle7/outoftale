import { invalidateAll } from "$app/navigation";
import { addId } from "$lib";
import { error } from "@sveltejs/kit";

async function loadDiscussion(pb, profile, id) {
    try {
        const discussion = await pb.collection('discussions').getOne(id);

        try {
            id = addId(id, profile.id);
            const res = await pb.collection('thoughts').getOne(id);
            discussion.react = res.react;
        } catch (err) {
            console.log(err.message);
        }
        return discussion;
    } catch (err) {
        console.log(err.message);
        error(404, `нет такого обсуждения`)
    }
}

export async function load({ params, locals }) {
    const pb = locals.pb;
    const profile = pb.authStore.model;

    const discussion = await loadDiscussion(pb, profile, params.id);

    return { discussion, profile };
}

