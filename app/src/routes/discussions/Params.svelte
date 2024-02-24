<script>
	import { discussion_topic, discussion_sort } from './data';

	import Search from '$lib/view/Search.svelte';
	import Radio from '$lib/view/Radio.svelte';
	import Select from '$lib/view/Select.svelte';
</script>

<Search key="search" title="Поиск" />

<Select key="topic" labels={discussion_topic} />
<Radio key="sort" labels={discussion_sort} />
