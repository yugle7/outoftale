<script>
	import { find, look } from './data';
	import { afterUpdate } from 'svelte';

	import Author from '$lib/show/Author.svelte';
	import Ago from '$lib/show/Ago.svelte';
	import Time from '$lib/show/Time.svelte';
	import Text from '$lib/text/Text.svelte';

	export let messages;

	const given = messages
		.filter(({ deleted }) => !deleted)
		.map(({ id, created, text, author }) => ({ id, created, text, author }));

	let found = [];
	$: if ($find > '') {
		const res = $find ? given.filter(({ text }) => text.toLowerCase().includes($find)) : given;

		let date;
		res.forEach((m) => {
			if (m.created.startsWith(date)) {
				m.date = null;
			} else {
				m.date = date = m.created.substring(0, 11);
			}
		});
		found = res;
	}

	let output;
	afterUpdate(() =>
		output.scroll({
			top: output.scrollHeight,
			behavior: 'auto'
		})
	);
</script>

<ul bind:this={output} class="col">
	{#each found as { id, date, author, created, text } (id)}
		{#if date}
			<div class="center line-2">
				<Ago time={date} />
			</div>
		{/if}
		<li class="padding-10">
			<button
				class="col text gap-5"
				on:click={() => {
					$find = null;
					$look = id;
				}}
			>
				<div>
					<Author {author} />
					<Time time={created} />
				</div>

				<Text {text} />
			</button>
		</li>
	{/each}
</ul>


