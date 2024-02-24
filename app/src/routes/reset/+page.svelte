<script>
	import { checkEmail } from '../signup/data';
	import { enhance } from '$app/forms';

	export let form;

	let errors = {};
	let email = '';

	$: disabled = errors.email || email === '';
</script>

<svelte:head>
	<title>Сброс пароля</title>
</svelte:head>

{#if form?.email}
	<div class="auth">
		<p>Ссылка восстановления пароля была успешно отправлена на почту <code>{form.email}</code>.</p>
		<a class="right" href="/users">Вернуться на сайт?</a>
	</div>
{:else}
	<form
		class="auth"
		method="post"
		use:enhance={(cancel) => {
			if (disabled) cancel();
		}}
	>
		<div class="col">
			<input
				class="input"
				autocomplete="off"
				class:failed={errors.email}
				placeholder="Email"
				bind:value={email}
				on:keydown={() => {
					delete errors.email;
					if (form) delete form.error;
				}}
				on:blur={() => {
					errors.email = checkEmail(email);
				}}
				id="email"
				type="email"
				name="email"
				required
			/>
			{#if errors.email}
				<span class="failed">{errors.email}</span>
			{/if}
		</div>

		<div class="col">
			{#if form?.error}
				<span class="failed">{form.error}</span>
			{/if}
			<button class="button" {disabled} type="submit">Восстановить</button>
			<a class="right font-14" href="/login">Вернуться в форму входа?</a>
		</div>
	</form>
{/if}
