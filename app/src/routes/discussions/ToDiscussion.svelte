<script>
	import { discussion_topic } from './data';

	import ToReact from './ToReact.svelte';
	import ToAuthor from '$lib/show/ToAuthor.svelte';
	import Date from '$lib/show/Date.svelte';

	import Text from '$lib/text/Text.svelte';

	export let discussion;
	export let params;

	export let profile;

	const { id, title, text, topic, author, updated } = discussion;

	$: subtitle = params.topic == null ? discussion_topic[topic] : '';
</script>

<div class="col relative content-900 gap-10 padding-20">
	<a class="col top" href="/discussions/{id}?type=1">
		<h2 class="line-1">{title}</h2>
		<span class="subtitle">{subtitle}</span>
	</a>

	<Text {text} />

	<div class="row away center">
		<ToReact {profile} {discussion} />
		<span class="right line-2">
			<ToAuthor {author} />
			<Date time={updated} />
		</span>
	</div>
</div>
