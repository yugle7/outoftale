<script>
	import { enhance } from '$app/forms';
	import { params, screen } from '$lib';

	import Selects from '$lib/edit/Selects.svelte';
	import Text from '$lib/edit/Text.svelte';

	import { problem_category } from '../../problems/data';
	import Close from '../Close.svelte';

	export let data;
	const { profile } = data;

	$params = { categories: []};
	$: disabled = !$params.title || !$params.condition || !$params.categories.length;
</script>

{#if $screen}
	<Close {profile} />
{/if}

<form method="post" class="col content-900 padding-20 gap-30" use:enhance>
	<Text key="title" title="Название" />

	<Selects key="categories" title="Категории" labels={problem_category} />

	<Text key="condition" title="Условие" />
	<Text key="notes" title="Примечания" />

	<Text key="answer" title="Ответ" />
	<Text key="proof" title="Доказательство" />

	<div class="row gap-15 center right">
		{#if !$screen}
			<a href="/users/{profile.username}">Отменить</a>
		{/if}
		<button class="button" {disabled} type="submit">Предложить</button>
	</div>
</form>
