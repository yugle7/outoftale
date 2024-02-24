import { fail } from "@sveltejs/kit";

import { PASSWORD } from '$env/static/private';
import crypto from 'crypto';

export const actions = {
    default: async ({ request, locals }) => {
        const pb = locals.pb;

        const data = await request.formData();

        const email = data.get('email');

        const hash = crypto.createHash('sha256')
        hash.update(data.get('password'))
        hash.update(PASSWORD)
        const password = hash.digest('hex')

        const username = data.get('username');

        try {
            await pb.collection('users').create({
                email,
                password,
                passwordConfirm: password,
                username,
            });
        } catch (err) {
            return fail(401, { error: err.message });
        }
        try {
            await pb.collection('users').authWithPassword(email, password);
            const res = await pb.collection('users').requestVerification(email);

            if (!res) {
                return fail(401, { error: 'не получилось отправить письмо' });
            }
            return { profile: pb.authStore.model }

        } catch (err) {
            return fail(401, { error: err.message });
        }
    }
}
