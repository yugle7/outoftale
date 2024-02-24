import { addId } from '../../lib/index.js';
import { default_params } from './data';

async function loadProblems(pb, profile, params) {
    const filters = [`author_id="${profile.id}"`, 'progress=5'];

    const { weight, status, category } = params;
    if (weight != null) filters.push(`problem.weight=${weight}`);
    if (status != null) filters.push(`problem.status=${status}`);
    if (category != null) filters.push(`problem.categories~${category}`);

    const res = await pb.collection('solutions').getFullList({
        filter: filters.join('&&')
    });
    return res.map(({ problem_id }) => problem_id);
}

async function loadSolutions(pb, profile, params) {
    const { sort, progress, author_id, problem_id, reviewer_id, reviewed } = params;

    const filters = [`progress=${progress}`];
    if (problem_id) {
        const res = await pb.collection('solutions').getOne(addId(problem_id, profile.id));
        if (res.progress !== 5) return [];
    } else {
        const problems = await loadProblems(pb, profile, params);
        if (problems.length === 0) return [];
        filters.push('(' + problems.map((p) => `problem_id="${p}"`).join('||') + ')');
    }

    if (reviewer_id) {
        filters.push(`reviewer_id="${reviewer_id}"`);
    } else if (reviewed != null) {
        filters.push(reviewed ? 'reviewer_id!=null' : 'reviewer_id=null');
    }
    if (author_id) {
        filters.push(author_id ? `author_id="${author_id}"` : `author_id!="${profile.id}"`);
    }
    if (problem_id) filters.push(`problem_id="${problem_id}"`);

    const res = await pb.collection('solutions').getList(1, 1000, {
        filter: filters.join('&&'),
        sort
    });
    return res.items;
}

export async function load({ locals, url }) {
    const pb = locals.pb;
    const profile = pb.authStore.model;

    const params = { ...default_params };
    for (const key of ['sort', 'weight', 'category', 'progress', 'status', 'author_id', 'problem_id', 'reviewer_id']) {
        params[key] = url.searchParams.get(key) || params[key];
    }

    if (url.searchParams.get('reviewed')) {
        params.reviewed = +url.searchParams.get('reviewed');
    }

    return {
        solutions: loadSolutions(pb, profile, params),
        profile,
        params
    };
}
