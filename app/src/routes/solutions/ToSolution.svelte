<script>
	import ToAuthor from '$lib/show/ToAuthor.svelte';
	import Date from '$lib/show/Date.svelte';
	import Text from '$lib/text/Text.svelte';

	import { problem_category } from '../problems/data';
	import { solution_progress } from './data';

	export let solution;

	const { id, problem, answer, proof } = solution;

	const getSubtitle = () => {
		const { weight, categories } = problem;

		const names = [weight];
		names.push(categories.map((c) => problem_category[c]).join(', '));

		return names.join(' – ');
	};
</script>

<div class="col relative content-900 padding-20 gap-10">
	<a class="col top" href="/solutions/{id}">
		<h2 class="line-1">{problem.title}</h2>
		<span class="subtitle">{getSubtitle()}</span>
	</a>

	{#if answer}
		<p class="col">
			<span class="label">Ответ</span>
			<Text text={answer} />
		</p>
	{/if}

	{#if proof}
		<p class="col">
			<span class="label">Доказательство</span>
			<Text text={proof} />
		</p>
	{/if}

	<span class="line-1">
		<span class="subtitle">{solution_progress[solution.progress]}</span>
		<span class="right">
			<ToAuthor author={solution.author} />
			<Date time={solution.created} />
		</span>
	</span>
</div>
