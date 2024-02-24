
export async function load({ locals }) {
    return {
        profile: locals.pb.authStore.model
    }
}