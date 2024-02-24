import { addId, getAuthor, getProblem } from "$lib";
import { error } from "@sveltejs/kit";

async function loadSolution(pb, profile, problem) {
    const id = addId(problem.id, profile.id);
    try {
        return await pb.collection('solutions').getOne(id);
    } catch (err) {
        console.log(err.message);

        return await pb.collection('solutions').create({
            id,
            author_id: profile.id,
            author: getAuthor(profile),
            problem_id: problem.id,
            problem: getProblem(problem)
        });
    }
}
async function loadProblem(pb, id) {
    try {
        return await pb.collection('problems').getOne(id);
    } catch (err) {
        console.log(err.message);
        error(404, 'нет такой задачи')
    }
}

export async function load({ params, locals }) {
    const pb = locals.pb;
    const profile = pb.authStore.model;

    const problem = await loadProblem(pb, params.id);
    let solution;

    if (profile) {
        solution = await loadSolution(pb, profile, problem);
        problem.react = solution.react;
    }

    return {
        problem,
        solution,
        profile
    };
}

