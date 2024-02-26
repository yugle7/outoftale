import { addId } from '$lib';

export async function load({ url }) {
    let type = url.searchParams.get('type');
    if (type != null) type = +type;
    return {
        params: { type }
    };
}

export const actions = {
    delete: async ({ request, locals }) => {
        const pb = locals.pb;

        const data = await request.formData();

        const talk_id = data.get('talk_id');
        const deleted = data.get('deleted') === 'true';

        try {
            await pb.collection('talks').update(talk_id, { deleted });

        } catch (err) {
            console.log(err.message);
        }
    }
}