import { error, redirect } from "@sveltejs/kit";


async function loadSolution(pb, id) {
    try {
        return await pb.collection('solutions').getOne(id, { expand: 'problem_id' });
    } catch (err) {
        console.log(err.message);
        error(404, 'нет такого решения')
    }
}

export async function load({ params, locals }) {
    const pb = locals.pb;
    
    const profile = pb.authStore.model;
    if (!profile) throw redirect('/login');

    const solution = await loadSolution(pb, params.id);
    if (!solution) return {};
 
    const problem = solution.expand.problem_id;
    delete solution.expand;

    const { reviewer_id, reviewer } = solution;
    if (reviewer_id && reviewer_id !== profile.id) {
        const res = await pb.collection('users').getOne(reviewer_id);
        reviewer.role = res.role;
    }

    return {
        solution,
        problem,
        profile
    };
}
