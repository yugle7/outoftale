import PocketBase from 'pocketbase';
import { PB_URL } from '$env/static/private'

export const handle = async ({ event, resolve }) => {
    event.locals.pb = new PocketBase(PB_URL);

    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

    try {
        event.locals.pb.authStore.isValid && await event.locals.pb.collection('users').authRefresh();
    } catch (err) {
        console.log(err.message);
        event.locals.pb.authStore.clear();
    }
    const response = await resolve(event);

    response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie({ sameSite: 'Lax' }));
    return response;
}
