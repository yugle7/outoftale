<script>
	import Text from '$lib/text/Text.svelte';

	export let solution;

	const { answer, proof } = solution;
</script>

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
