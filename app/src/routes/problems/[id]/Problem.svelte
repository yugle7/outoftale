<script>
	import Text from '$lib/text/Text.svelte';
	import Hide from '$lib/show/Hide.svelte';
	
	import ToReact from '../ToReact.svelte';
	import ToAuthor from '$lib/show/ToAuthor.svelte';
	import Date from '$lib/show/Date.svelte';

	import { problem_category } from '../data';

	export let problem;
	export let solution;
	export let profile;

	const { title, condition, notes, answer, proof, author_id, author, changed } = problem;

	const getSubtitle = () => {
		let { weight, categories, like } = problem;
		categories = categories.map((c) => problem_category[c]).join(', ');
		const names = [weight, categories];
		if (like) names.push(like);
		return names.join(' – ');
	};
</script>

<div class="col padding-20 gap-10 content-900">
	<div class="col top">
		<h1 class="line-1">{title}</h1>
		<span class="subtitle">{getSubtitle()}</span>
	</div>

	<Text text={condition} />

	{#if problem.notes}
		<Hide label="Примечания">
			<Text text={notes} />
		</Hide>
	{/if}

	{#if profile && (answer || proof) && (profile.role >= 3 || solution.progress === 5 || author_id === profile.id)}
		<Hide label="Решение">
			<div class="col gap-10">
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

	<div class="row away center">
		<ToReact {profile} {problem} />
		
		<span class="right">
			<ToAuthor {author} />
			<Date time={changed} />
		</span>
	</div>
</div>
