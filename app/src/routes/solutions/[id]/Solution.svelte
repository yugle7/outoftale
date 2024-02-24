<script>
	import { enhance } from '$app/forms';
	import { solution_progress } from '../data';

	import Text from '$lib/text/Text.svelte';

	import ToAuthor from '$lib/show/ToAuthor.svelte';
	import Date from '$lib/show/Date.svelte';

	import Progress from './Progress.svelte';
	import Author from '$lib/show/Author.svelte';

	export let solution;
	export let problem;
	export let profile;
	
	export let chat = true;
	$: reviewer_id = solution.reviewer_id;
</script>

<div class="highlighted">
	<div class="col gap-10 padding-40-20 content-900">
		<div class="col">
			{#if solution.answer}
				<div class="col">
					<span class="label">Ответ</span>
					<Text text={solution.answer} />
				</div>
			{/if}
			{#if solution.proof}
				<div class="col">
					<span class="label">Доказательство</span>
					<Text text={solution.proof} />
				</div>
			{/if}
		</div>

		<span class="line-1">
			{#if reviewer_id !== profile.id}
				<span class="subtitle">{solution_progress[solution.progress]}</span>
			{/if}
			<span class="right">
				<ToAuthor author={solution.author} />
				<Date time={solution.created} />
			</span>
		</span>

		<div class="line-2 top-10">
			{#if profile.id !== solution.author_id}
				{#if reviewer_id}
					{#if profile.id === reviewer_id}
						{#if reviewer_id === profile.id}
							<Progress {solution} {problem} {profile} />
						{/if}
					{:else}
						<span class="subtitle">Взято – <Author author={solution.reviewer} /></span>
					{/if}
				{/if}
				<form method="post" action="?/review" class="row gap-15 right" use:enhance>
					{#if chat}
						<a href="?type=7" on:click|stopPropagation>Написать</a>
					{/if}
					{#if !reviewer_id}
						<button class="button">Взять</button>
					{:else if profile.id === reviewer_id}
						<button class="button">Отдать</button>
					{:else if profile.role > solution.reviewer.role}
						<button class="button">Отобрать</button>
					{/if}
				</form>
			{/if}
		</div>
	</div>
</div>
