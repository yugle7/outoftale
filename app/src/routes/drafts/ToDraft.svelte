<script>
	import { problem_category } from '../problems/data';

	import ToReact from './ToReact.svelte';
	import ToAuthor from '$lib/show/ToAuthor.svelte';
	import Date from '$lib/show/Date.svelte';

	import Text from '$lib/text/Text.svelte';

	export let draft;
	export let profile;

	const { id, title, condition } = draft;

	const getSubtitle = () => {
		let { categories, like } = draft;

		const names = [];
		names.push(categories.map((c) => problem_category[c]).join(', '));
		if (like) names.push(like);

		return names.join(' – ');
	};
</script>

<div class="col content-900 relative padding-20 gap-10">
	<a class="col top" href="/drafts/{id}">
		<h2 class="line-1">{title}</h2>
		<span class="subtitle">{getSubtitle()}</span>
	</a>
	
	<Text text={condition} />

	<p class="row away center">
		<ToReact {profile} {draft} />
		<span class="right">
			<ToAuthor author={draft.editor} />
			<Date time={draft.created} />
		</span>
	</p>
</div>
