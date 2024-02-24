<script>
	import { enhance } from '$app/forms';
	import { params } from '$lib';

	import Radio from '$lib/edit/Radio.svelte';
	import Text from '$lib/edit/Text.svelte';

	import { discussion_topic } from '../data';

	export let discussion;

	const { title, topic, text } = discussion;
	$params = { title, topic, text };

	$: disabled = !Object.entries($params).some(([k, v]) => v != discussion[k]);
</script>

<form method="post" class="col gap-30 padding-20 content-900 scroll" use:enhance>
	<Text key="title" title="Заголовок" />

	<Radio key="topic" title="Раздел" labels={discussion_topic} />
	<Text key="text" title="Описание" />

	<div class="row right gap-15">
		<button class="link" on:click|preventDefault|stopPropagation>Отменить</button>
		<button class="button right" {disabled} type="submit">Обновить</button>
	</div>
</form>
