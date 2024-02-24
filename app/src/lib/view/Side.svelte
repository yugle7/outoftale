<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { params } from '$lib';

	export let default_params;

	$params = { ...default_params };
	$page.url.searchParams.forEach((v, k) => ($params[k] = v));

	$: if ($params) {
		const url = new URL($page.url);

		for (const [k, v] of Object.entries($params)) {
			if (v != default_params[k]) {
				url.searchParams.set(k, v);
			} else {
				url.searchParams.delete(k);
			}
		}
		goto(url);
	}
</script>

<div class="col gap-40 padding-20 side font-16">
	<slot />
</div>
