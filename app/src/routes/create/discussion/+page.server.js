import { redirect } from "@sveltejs/kit";
import { getAuthor } from "$lib";


export const actions = {
    default: async ({ request, locals }) => {
        const pb = locals.pb;
        const profile = pb.authStore.model;

        if (!profile) throw redirect('/login');

        const data = await request.formData();

        const title = data.get('title');
        const topic = +data.get('topic') || 0;
        const text = data.get('text');

        if (title !== '' && text !== '') {
            const res = await pb.collection('discussions').create({
                title,
                topic,
                text,
                author_id: profile.id,
                author: getAuthor(profile),
                changed: new Date()
            });
            await pb.collection('users').update(profile.id, { 'discussions+': 1 });
            
            redirect(303, `/discussions/${res.id}`);
        }
    }
}