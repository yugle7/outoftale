<script>
	import Status from './Status.svelte';

	export let problem;
	export let solution;
	export let profile;
</script>

{#if profile}
	<div class="col padding-20 center gap-20 line-0">
		{#if profile.role >= 3 || (profile.role === 2 && solution.progress === 5) || problem.author_id === profile.id}
			<Status {problem} {profile} />

			<div class="row gap-15">
				{#if problem.solutions > 0}
					<a href="/solutions?problem_id={problem.id}">Проверить решения</a>
				{/if}

				{#if problem.drafts > 0}
					<a href="/drafts?problem_id={problem.id}">Посмотреть правки</a>
				{/if}

				<button class="link center line-0" on:click>Исправить задачу</button>
			</div>
		{/if}
	</div>
{:else}
	<div class="col">
		<a class="padding-20 center" href="/login">Войти, чтобы решить</a>
	</div>
{/if}
