import { default_params } from './data.js';

async function getFriends(pb, profile) {
    if (!profile) return [];

    const res = await pb.collection('friends').getFullList({
        filter: `profile_id="${profile.id}"`
    });
    const friends = res.map((f) => f.user_id);
    return friends;
}

async function getPositions(pb) {
    const positions = {};

    const res = await pb.collection('positions').getFullList({ filter: 'users>1' });
    res.forEach(({ id, users }) => (positions[+id] = users));

    return positions;
}

function getUser(user, friends, positions) {
    const { id, username, rating, role } = user;
    return { id, username, position: positions[rating] || 1, rating, role, friend: friends.has(id) }
}

async function loadUsers(pb, profile, params) {
    const { role, wanted, friend } = params;    
    if (wanted && role >= profile.role) return [];

    let { sort } = params;

    const filters = [];
    const friends = new Set(await getFriends(pb, profile));

    if (friend) {
        filters.push('(' + [...friends, profile.id].map(f => `id="${f}"`).join('||') + ')');
    }
    if (wanted) {
        filters.push('wanted!=null');
        sort = sort.replace('created', 'wanted');
    }
    filters.push(role == null ? (wanted ? 'role<' + profile.role : 'rating>0') : `role=${role}`)

    const res = await pb.collection('users').getList(1, 1000, {
        filter: filters.join('&&'),
        sort
    });
    const positions = await getPositions(pb);
    return res.items.map(u => getUser(u, friends, positions));
}

export async function load({ url, locals }) {
    const pb = locals.pb;
    const profile = pb.authStore.model;

    const params = { ...default_params };
    for (const key of ['sort', 'role']) {
        params[key] = url.searchParams.get(key) || params[key];
    }

    if (profile) {
        for (const key of ['friend', 'wanted']) {
            if (url.searchParams.get(key)) params[key] = +url.searchParams.get(key);
        }
        params.wanted = profile.role >= 2 && params.wanted;
    }

    const users = loadUsers(pb, profile, params);

    return {
        users,
        profile,
        params
    };
}
