import PocketBase from 'pocketbase';
import { PB_URL } from '$env/static/private'

export const handle = async ({ event, resolve }) => {
    event.locals.pb = new PocketBase(PB_URL);
    const pb = event.locals.pb;

    pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

    try {
        pb.authStore.isValid && await pb.collection('users').authRefresh();
    } catch (err) {
        console.log(err.message);
        pb.authStore.clear();
    }
    const response = await resolve(event);
    response.headers.append('set-cookie', pb.authStore.exportToCookie({ sameSite: 'Lax', secure: false }));
    response.headers.append('Access-Control-Allow-Origin', '*');
    return response;
}
