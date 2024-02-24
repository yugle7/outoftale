<script>
	import { enhance } from '$app/forms';
	import { params } from '$lib';

	import Radio from '$lib/edit/Radio.svelte';
	import Text from '$lib/edit/Text.svelte';

	import { discussion_topic } from '../../discussions/data';
	import Close from '../Close.svelte';

	export let data;
	const { profile } = data;

	$params = {};
	$: disabled = ['title', 'topic', 'text'].some((k) => !$params[k]);
</script>

<Close {profile} />

<form method="post" class="col padding-20 gap-30 content-900" use:enhance>
	<Text key="title" title="Заголовок" />
	
	<Radio key="topic" title="Раздел" labels={discussion_topic} />
	
	<Text key="text" title="Описание" />

	<button class="button right" {disabled} type="submit">Создать</button>
</form>
