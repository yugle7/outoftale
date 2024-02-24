<script>
	import { chat_type, getTitle, getUrl } from './data';

	export let chat;
	export let talk;

	export let params;
</script>

<a class="col top" href={getUrl(chat)}>
	<h2 class="line-1 right-50">{getTitle(chat, talk)}</h2>
	{#if params.type == null && chat.type}
		<span class="subtitle">{chat_type[chat.type]}</span>
	{/if}
</a>
