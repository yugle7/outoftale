<script>
	import { params } from '$lib';
	import { normText } from '../edit/data';

	export let key = 'search';
	export let title;

	let value = $params[key];

	const handleSearch = async (e) => {
		if (e.key === 'Enter') {
			$params[key] = normText(value);
			e.preventDefault();
			return true;
		}
	};
</script>

<input
	class="input"
	placeholder={title}
	id={key}
	type="search"
	bind:value
	on:blur={() => ($params[key] = normText(value))}
	on:keydown={handleSearch}
	on:click|stopPropagation
/>

<style>
	input {
		margin-left: -10px;
		width: calc(100% + 10px);
	}
</style>
