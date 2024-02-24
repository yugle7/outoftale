<script>
	import Text from '$lib/text/Text.svelte';
	import Hide from '$lib/show/Hide.svelte';

	import ToReact from '../ToReact.svelte';
	import ToAuthor from '$lib/show/ToAuthor.svelte';
	import Date from '$lib/show/Date.svelte';

	import { problem_category } from '../../problems/data';
	import { enhance } from '$app/forms';

	export let draft;
	export let problem;
	export let profile;

	export let chat = false;

	const { weight } = problem;

	const getSubtitle = () => {
		const { like, categories } = draft;
		const names = [weight, categories.map((c) => problem_category[c]).join(', ')];
		if (like) names.push(like);
		return names.join(' – ');
	};

	$: notes = draft.notes;
	$: answer = draft.answer;
	$: proof = draft.proof;

	const { problem_id } = draft;
</script>

<div class="col padding-20 scroll gap-10 content-900">
	<div class="col top">
		<h1 class="line-1">{draft.title}</h1>
		<span class="subtitle">{getSubtitle()}</span>
	</div>

	<Text text={draft.condition} />

	{#if notes}
		<Hide label="Примечания">
			<Text text={notes} />
		</Hide>
	{/if}

	{#if answer || proof}
		<Hide label="Решение">
			<div class="col gap-10">
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
			</div>
		</Hide>
	{/if}

	<p class="row away center">
		<ToReact {profile} {draft} />
		<span class="right">
			<ToAuthor author={draft.editor} />
			<Date time={draft.changed} />
		</span>
	</p>

	<form method="post" action="?/apply" class="top-20 line-2" use:enhance>
		<div class="row gap-15 right bottom-20">
			{#if draft.deleted}
				<span class="label">Удалено</span>
				<button class="button" formaction="?/restore" on:click={() => (draft.deleted = false)}>
					Вернуть
				</button>
			{:else if draft.applied}
				<span class="label">Применено</span>
				<button class="button" formaction="?/cancel" on:click={() => (draft.applied = false)}>
					Отменить
				</button>
			{:else}
				{#if profile.role >= 3}
					<button class="link" formaction="?/delete">Удалить</button>
				{/if}

				{#if profile.id === draft.editor_id || profile.role >= 3}
					<button class="link" on:click|preventDefault|stopPropagation>Обновить</button>
				{/if}

				{#if draft.like > 80 || profile.role >= 3}
					<input type="hidden" value={problem_id} name="problem_id" id="problem_id" />
					<button class="button" type="submit">Применить</button>
				{/if}
			{/if}
		</div>
	</form>

	<div class="center line-1">
		<a href="/problems/{problem_id}">Перейти в задачу</a>
		<br />
		{#if chat}
			<a href="?type=8">Открыть чат</a>
		{/if}
	</div>
</div>
