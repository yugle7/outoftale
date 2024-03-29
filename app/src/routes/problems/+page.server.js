import { addId, getAuthor } from '$lib';
import { default_params } from './data';

async function loadSolutions(pb, profile) {
    const res = await pb.collection('solutions').getFullList({
        filter: `author_id="${profile.id}"`
    });
    if (res.length) {
        const solutions = {};

        res.forEach(({ problem_id, progress, react }) => (solutions[problem_id] = { progress, react }));
        return solutions;
    }
}

async function loadProblems(pb, profile, params) {
    const { sort, category, weight, status, author_id, progress } = params;

    const filters = [];
    if (weight != null) filters.push(`weight=${weight}`);
    if (status != null) filters.push(`status=${status}`);

    if (category != null) filters.push(`categories~'"${category}"'`);
    if (author_id) filters.push(`author_id="${author_id}"`);

    const problems = await pb.collection('problems').getFullList({
        filter: filters.join('&&'),
        sort
    });

    if (profile) {
        const solutions = await loadSolutions(pb, profile);

        if (solutions) problems.forEach(p => {
            const s = solutions[p.id];
            if (s) {
                p.progress = s.progress;
                p.react = s.react;
            }
        });
        if (progress) return problems.filter(p => (1 << p.progress) & progress);
    }
    return problems;
}

export async function load({ locals, url }) {
    const pb = locals.pb;
    const profile = pb.authStore.model;

    const params = { ...default_params };
    for (const key of ['weight', 'category', 'author_id']) params[key] = url.searchParams.get(key);

    const sort = url.searchParams.get('sort');
    if (sort) params.sort = sort;

    if (profile) {
        const status = url.searchParams.get('status');
        if (status != null && profile.role >= 2) params.status = parseInt(status);

        const progress = url.searchParams.get('progress');
        if (progress) params.progress = parseInt(progress);
    }
    return {
        problems: loadProblems(pb, profile, params),
        profile,
        params
    };
}

export const actions = {
    react: async ({ request, locals }) => {
        const pb = locals.pb;
        const profile = pb.authStore.model;

        const data = await request.formData();

        const problem_id = data.get('problem_id');
        const react = data.get('react');

        const id = addId(profile.id, problem_id);

        try {
            const res = await pb.collection('solutions').getOne(id);

            if (res.react === react) return;
            await pb.collection('solutions').update(id, { react });

            const data = {};
            if (res.react > 0) data[res.react + '-'] = 1;
            if (react > 0) data[react + '+'] = 1;

            await pb.collection('problems').update(problem_id, data);

        } catch (err) {
            console.log(err.message);

            const data = {};
            data[react + '+'] = 1;

            await pb.collection('problems').update(problem_id, data);

            await pb.collection('solutions').create({
                id,
                react,
                author_id: profile.id,
                author: getAuthor(profile),
                problem_id
            });
        }

    }
}