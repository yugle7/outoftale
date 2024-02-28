<script>
	import { params } from '$lib';
	import { copyPaste } from '$lib/edit/data';

	export let key;
	export let title;
	
	let value = $params[key];
	$: $params[key] = value;
</script>

<input name={key} id={key} type="hidden" {value} />
<div
	role="textbox"
	tabindex="0"
	on:paste|preventDefault={copyPaste}
	contenteditable="true"
	placeholder={title}
	bind:innerText={value}
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
