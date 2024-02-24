<script>
	import { checkPassword, auth_provider, checkLogin } from '../signup/data';
	import { enhance } from '$app/forms';
	import { back } from '$lib';

	export let data;
	export let form;

	let login = '';
	let password = '';

	let errors = {};

	$: disabled = errors.password || errors.login || form?.error || password === '' || login === '';
</script>

<svelte:head>
	<title>Вход</title>
</svelte:head>

<form
	class="auth"
	method="post"
	action="?/login"
	use:enhance={(cancel) => {
		if (disabled) cancel();
	}}
>
	{#each data.providers as provider}
		<button class="button" formaction="?/{provider.name}">{auth_provider[provider.name]}</button>
	{/each}

	{#if data.providers.length > 0}
		<span class="center font-14">или</span>
	{/if}

	<div class="col">
		<input
			class="input"
			class:failed={errors.login}
			placeholder="Email или Username"
			bind:value={login}
			on:keydown={() => {
				delete errors.login;
				if (form) delete form.error;
			}}
			on:blur={() => {
				errors.login = checkLogin(login);
			}}
			id="login"
			type="text"
			name="login"
			required
		/>
		{#if errors.login}
			<span class="failed">{errors.login}</span>
		{/if}
	</div>

	<div class="col">
		<input
			class="input"
			class:failed={errors.password}
			placeholder="Пароль"
			bind:value={password}
			on:keydown={() => {
				delete errors.password;
				if (form) delete form.error;
			}}
			on:blur={() => {
				errors.password = checkPassword(password);
			}}
			id="password"
			type="password"
			name="password"
			required
		/>
		{#if errors.password}
			<span class="failed">{errors.password}</span>
		{/if}
		<a class="right font-14" href="/reset">Забыл пароль?</a>
	</div>

	<input type="hidden" value={$back} name="back" id="back" />

	<div class="col">
		{#if form?.error}
			<span class="failed">{form.error}</span>
		{/if}
		<button class="button" {disabled} type="submit">Войти</button>
		<a class="right font-14" href="/signup">Eще нет аккаунта?</a>
	</div>
</form>
