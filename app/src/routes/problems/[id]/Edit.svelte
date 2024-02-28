<script>
	import { enhance } from '$app/forms';
	import { params } from '$lib';

	import Selects from '$lib/edit/Selects.svelte';
	import Text from '$lib/edit/Text.svelte';

	import { problem_category } from '../data';

	export let profile;
	export let problem;

	const { title, categories, condition, notes, answer, proof, status, author_id } = problem;
	let action = 'create';

	const p = { title, categories, condition, notes, answer, proof };
	$params = { ...p };

	$: disabled = JSON.stringify($params) === JSON.stringify(p) || !$params.categories.length;
</script>

<form method="post" action="?/edit" class="col scroll padding-20 gap-30 content-900" use:enhance>
	<Text key="title" title="Название" />

	<Selects key="categories" title="Категории" labels={problem_category} />

	<Text key="condition" title="Условие" />
	<Text key="notes" title="Примечания" />

	<Text key="answer" title="Ответ" />
	<Text key="proof" title="Доказательство" />

	<input type="hidden" bind:value={action} name="action" id="action" />

	<div class="row gap-15 right">
		<button class="link" on:click|preventDefault|stopPropagation>Отменить</button>

		{#if profile.role >= 3 || (author_id === profile.id && status < 4)}
			<button class="link" {disabled} on:click={() => (action = 'update')}>Обновить</button>
		{/if}

		<button class="button" {disabled} type="submit">Поправить</button>
	</div>
</form>
