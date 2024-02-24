export async function load({ url }) {
    let type = url.searchParams.get('type');
    if (type != null) type = +type;
    return {
        params: { type }
    };
}
