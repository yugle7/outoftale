<script>
	import { problem_category } from './data';
	import { solution_progress } from '../solutions/data';


	import ToReact from './ToReact.svelte';
	import ToAuthor from '$lib/show/ToAuthor.svelte';
	
	import Date from '$lib/show/Date.svelte';
	import Text from '$lib/text/Text.svelte';

	export let problem;
	export let params;

	export let profile;

	const { id, title, condition, author, changed } = problem;

	const isPowerOfTwo = (n) => n > 0 && !(n & (n - 1));

	const getSubtitle = () => {
		let { weight, categories, like, progress } = problem;

		const names = [weight];
		names.push(categories.map((c) => problem_category[c]).join(', '));
		if (!isPowerOfTwo(params.progress) && progress != null) names.push(solution_progress[progress]);
		if (like) names.push(like);

		return names.join(' – ');
	};
</script>

<div class="col relative content-900 padding-20 gap-10">
	<a class="col top" href="/problems/{id}">
		<h2 class="line-1">{title}</h2>
		<span class="subtitle">{getSubtitle()}</span>
	</a>
	
	<Text text={condition} />

	<div class="row away center">
		<ToReact {profile} {problem} />
		
		<span class="right">
			<ToAuthor {author} />
			<Date time={changed} />
		</span>
	</div>
</div>
