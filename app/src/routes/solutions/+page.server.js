import { addId, getProblem } from '../../lib/index.js';
import { default_params } from './data';

async function loadProblems(pb, profile, params) {
    const filters = [`author_id="${profile.id}"`, 'progress=5'];

    const { weight, status, category } = params;

    const res = await pb.collection('solutions').getFullList({
        filter: filters.join('&&'),
        expand: 'problem_id'
    });

    const problems = {};

    res.map(({ expand }) => expand.problem_id).filter(
        p =>
            (weight == null || p.weight == weight) &&
            (status == null || p.status == status) &&
            (category == null || p.categories.includes(category))
    ).forEach(p => (problems[p.id] = getProblem(p)));

    return problems;
}

async function loadSolutions(pb, profile, params) {
    const { sort, progress, author_id, problem_id, reviewer_id, reviewed } = params;

    let problems = {};

    const filters = [`progress=${progress}`];
    if (problem_id) {
        const res = await pb.collection('solutions').getOne(addId(problem_id, profile.id), { expand: 'problem_id' });
        if (res.progress !== 5) return [];

        problems[problem_id] = getProblem(res.expand.problem_id);
        filters.push(`problem_id="${problem_id}"`);
    } else {
        problems = await loadProblems(pb, profile, params);
        
        const ids = Object.keys(problems);
        if (ids.length === 0) return [];
        filters.push('(' + ids.map((id) => `problem_id="${id}"`).join('||') + ')');
    }

    if (reviewer_id) {
        filters.push(`reviewer_id="${reviewer_id}"`);
    } else if (reviewed != null) {
        filters.push(reviewed ? 'reviewer_id!=null' : 'reviewer_id=null');
    }
    if (author_id) {
        filters.push(author_id ? `author_id="${author_id}"` : `author_id!="${profile.id}"`);
    }
    console.log(filters);

    const res = await pb.collection('solutions').getList(1, 1000, {
        filter: filters.join('&&'),
        sort
    });

    const solutions = res.items;
    solutions.forEach(s => (s.problem = problems[s.problem_id]));
    return solutions;
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
