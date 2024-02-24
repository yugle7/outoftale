<script>
	import Text from '$lib/text/Text.svelte';
	import Hide from '$lib/show/Hide.svelte';

	import { problem_category } from '../../problems/data';

	export let problem;

	const getSubtitle = () => {
		const { weight, categories } = problem;
		const names = [weight, categories.map((c) => problem_category[c]).join(', ')];
		return names.join(' – ');
	};

	$: notes = problem.notes;
	$: answer = problem.answer;
	$: proof = problem.proof;
</script>

<div class="col content-900 padding-20 gap-10">
	<a class="col top" href="/problems/{problem.id}">
		<h1 class="line-1">{problem.title}</h1>
		<span class="subtitle">{getSubtitle()}</span>
	</a>

	<Text text={problem.condition} />

	{#if notes}
		<Hide label="Примечания">
			<Text text={notes} />
		</Hide>
	{/if}

	{#if answer || proof}
		<Hide label="Решение">
			<div class="col">
				{#if answer}
					<div class="col">
						<span class="label">Ответ</span>
						<Text text={answer} />
					</div>
				{/if}
				{#if proof}
					<div class="col">
						<span class="label">Доказательство</span>
						<Text text={proof} />
					</div>
				{/if}
			</div>
		</Hide>
	{/if}
</div>
