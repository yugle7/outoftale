<script>
	import { enhance } from '$app/forms';
	import { params } from '$lib';

	import Selects from '$lib/edit/Selects.svelte';
	import Text from '$lib/edit/Text.svelte';

	import { problem_category } from '../../problems/data';

	export let draft;

	const { title, categories, condition, notes, answer, proof } = draft;
	$params = { title, categories, condition, notes, answer, proof };

	$: disabled = !Object.entries($params).some(([k, v]) => v != draft[k]);
</script>

<form method="post" action="?/edit" class="col scroll padding-20 content-900 gap-30" use:enhance>
	<Text key="title" title="Название" value={title} />

	<Selects key="categories" title="Категории" labels={problem_category} values={categories} />

	<Text key="condition" title="Условие" value={condition} />
	<Text key="notes" title="Примечания" value={notes} />

	<Text key="answer" title="Ответ" value={answer} />
	<Text key="proof" title="Доказательство" value={proof} />

	<div class="row gap-15 right">
		<button class="link" on:click|preventDefault|stopPropagation>Отменить</button>
		<button class="button" {disabled} type="submit">Обновить</button>
	</div>
</form>
