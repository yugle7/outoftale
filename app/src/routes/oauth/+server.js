import { redirect } from '@sveltejs/kit';

export const GET = async ({ locals, url, cookies }) => {
    const provider = JSON.parse(cookies.get('provider'));

    const state = await url.searchParams.get('state');
    const code = await url.searchParams.get('code');

    if (provider.state !== state) throw redirect(303, '/login?oauth=error');

    try {
        const res = await locals.pb.collection('users').authWithOAuth2Code(
            provider.name,
            code,
            provider.codeVerifier,
            url.origin + '/oauth'
        )
        throw redirect(303, `/users/${res.username}`);

    } catch (err) {
        console.error(err);
        return redirect(303, '/login?oauth=error');
    }

};