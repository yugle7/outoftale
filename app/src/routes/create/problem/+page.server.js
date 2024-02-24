import { redirect } from "@sveltejs/kit";
import { addId, getAuthor, getProblem } from "$lib";

export const actions = {
    default: async ({ request, locals }) => {
        const pb = locals.pb;

        const profile = pb.authStore.model;
        if (!profile) throw redirect('/login');

        const data = await request.formData();

        const title = data.get('title') || '';
        const condition = data.get('condition') || '';
        const categories = data.getAll('categories');

        const notes = data.get('notes') || null;
        const answer = data.get('answer') || null;
        const proof = data.get('proof') || null;

        if (
            title !== '' &&
            condition !== '' &&
            categories.length > 0
        ) {
            const solved = Boolean(answer || proof);

            const res = await locals.pb.collection('problems').create({
                title,
                categories,
                condition,
                notes,
                answer,
                proof,
                status: +solved,
                solutions: +solved,
                author_id: profile.id,
                author: getAuthor(profile),
                changed: new Date()
            });

            if (solved) {
                await locals.pb.collection('solutions').create({
                    id: addId(profile.id, res.id),
                    author_id: profile.id,
                    auhtor: res.author,
                    problem_id: res.id,
                    problem: getProblem(res),
                    answer,
                    proof,
                    step: 2,
                    progress: 5,
                    changed: res.changed
                });
            }
            await pb.collection('users').update(profile.id, { 'problems+': 1, 'solutions+': +solved });

            redirect(303, `/problems/${res.id}`);
        }
    }
}