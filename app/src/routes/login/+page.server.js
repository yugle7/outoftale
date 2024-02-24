import { fail, redirect } from "@sveltejs/kit";
import { PASSWORD } from '$env/static/private';
import crypto from 'crypto';


export const load = (async ({ locals, url }) => {
    if (locals.pb.authStore.model) return redirect(303, '/users');

    const authMethods = await locals.pb.collection('users').listAuthMethods();
    return { providers: authMethods.authProviders };
})

export const actions = {
    login: async ({ request, locals }) => {
        const pb = locals.pb;

        const data = await request.formData();

        const hash = crypto.createHash('sha256');
        hash.update(data.get('password'));
        hash.update(PASSWORD);
        const password = hash.digest('hex');

        try {
            const res = await pb.collection('users').authWithPassword(data.get('login'), password);
        } catch (err) {
            console.log(err.message);
            return fail(401, { error: err.message });
        }
        const { username } = pb.authStore.model;
        const back = data.get('back') || `/users/${username}`

        throw redirect(303, back);
    },
    yandex: async ({ locals, url, cookies }) => {
        const authMethods = await locals.pb.collection('users').listAuthMethods();
        const provider = authMethods.authProviders.find((p) => p.name === 'yandex');

        cookies.set('provider', JSON.stringify(provider), { httpOnly: true, path: '/oauth' });
        throw redirect(302, provider.authUrl + url.origin + '/oauth');
    },
    google: async ({ locals, url, cookies }) => {
        const authMethods = await locals.pb.collection('users').listAuthMethods();
        const provider = authMethods.authProviders.find((p) => p.name === 'google');

        cookies.set('provider', JSON.stringify(provider), { httpOnly: true, path: '/oauth' });
        throw redirect(302, provider.authUrl + url.origin + '/oauth');
    }
}