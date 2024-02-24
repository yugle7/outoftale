import { fail, redirect } from "@sveltejs/kit";


export const actions = {
    default: async ({ request, locals }) => {
        const data = await request.formData();
        const email = data.get('email');

        try {
            // await locals.pb.collection('users').requestPasswordReset(email);
        } catch (err) {
            return fail(401, { error: err.message });
        }
        return { email };
    },
}