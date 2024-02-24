<script>
	import { params } from '$lib';
	import { enhance } from '$app/forms';

	import { solution_progress } from '../../solutions/data';

	import Edit from '$lib/edit/Text.svelte';
	import Text from '$lib/text/Text.svelte';

	export let solution;

	$: answer = solution.answer;
	$: proof = solution.proof;

	$params = {};
	let progress;

	$: edit = !answer && !proof && solution;

	$: equal = $params.answer === answer && $params.proof === proof;
	$: empty = !$params.answer && !$params.proof;
</script>

<form method="post" action="?/progress" class="col gap-10 padding-40-20 content-900" use:enhance>
	<input type="hidden" bind:value={progress} name="progress" id="progress" />

	{#if edit}
		<Edit key="answer" title="Ответ" />
		<Edit key="proof" title="Решение" />

		<div class="row gap-15 right">
			{#if !empty && (!equal || solution.progress !== 1)}
				<button class="link shy" type="submit" on:click={() => (progress = 1)}>Сохранить</button>
			{/if}

			{#if solution.progress > 0}
				<button class="link" on:click|preventDefault|stopPropagation={() => (edit = false)}>
					Отменить
				</button>
			{/if}

			<button
				class="button"
				disabled={empty || (equal && solution.progress === 2)}
				on:click={() => (progress = 2)}
				type="submit"
			>
				{#if solution.progress > 0}
					Отправить
				{:else}
					Решить
				{/if}
			</button>
		</div>
	{:else}
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

		<div class="row gap-15 center right">
			<span class="label">{solution_progress[solution.progress]}</span>

			{#if solution.progress === 5}
				<button class="button" type="submit" on:click={() => (progress = 0)}>Отменить</button>
			{:else}
				<button
					class="button"
					on:click|preventDefault|stopPropagation={() => {
						$params = { answer, proof };
						edit = true;
					}}
				>
					Исправить
				</button>
			{/if}
		</div>
	{/if}
</form>
