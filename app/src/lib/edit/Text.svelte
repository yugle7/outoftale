<script>
	import { params } from '$lib';
	import { copyPaste } from '$lib/edit/data';

	export let key;
	export let title;
</script>

<input name={key} id={key} type="hidden" value={$params[key]} />
<div
	role="textbox"
	tabindex="0"
	on:paste|preventDefault={copyPaste}
	contenteditable="true"
	placeholder={title}
	bind:innerText={$params[key]}
/>

<style>
	div {
		width: 100%;
		outline: none;
		padding: 0;
	}
	div:empty:before {
		content: attr(placeholder);
		opacity: 0.5;
	}
</style>
