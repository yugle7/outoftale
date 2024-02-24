<script>
	import { screen } from '$lib';
	import { enhance } from '$app/forms';

	import { handlePaste } from '$lib/edit/data';

	export let data;
	export let form;

	$: profile = data.profile;
	let username, fullname, contacts;

	import { onMount } from 'svelte';
	import {
		normFullname,
		checkFullname,
		checkUsername,
		checkContacts,
		normContacts
	} from '../signup/data';

	$: disabled = Object.values(errors).some((e) => e);

	const e = {};
	$: errors = form?.errors || e;

	onMount(() => {
		username = profile.username;
		fullname = profile.fullname || '';
		contacts = profile.contacts?.join('\n') || '';
	});
</script>

<svelte:head>
	<title>Редактирование моего профиля</title>
</svelte:head>

{#if $screen}
	<a class="right" href="/users/{profile.username}">
		<img src="/icons/close.svg" alt="close" />
	</a>
{/if}

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
			class:failed={errors.username}
			placeholder="Логин"
			bind:value={username}
			on:keydown={() => delete errors.username}
			on:blur={() => (errors.username = checkUsername(username))}
			id="username"
			type="text"
			name="username"
			required
		/>
		{#if errors.username}
			<span class="failed">{errors.username}</span>
		{/if}
	</div>

	<div class="col">
		<input
			class="input"
			class:failed={errors.fullname}
			placeholder="Имя Фамилия"
			bind:value={fullname}
			on:keydown={() => delete errors.fullname}
			on:blur={() => {
				if (fullname !== '') {
					errors.fullname = checkFullname(fullname);
					if (!errors.fullname) fullname = normFullname(fullname);
				}
			}}
			id="fullname"
			type="text"
			name="fullname"
		/>
		{#if errors.fullname}
			<span class="failed">{errors.fullname}</span>
		{/if}
	</div>

	<div class="col">
		<input type="hidden" bind:value={contacts} id="contacts" name="contacts" />
		<div
			role="textbox"
			tabindex="0"
			contenteditable="true"
			on:keydown={() => delete errors.contacts}
			on:paste|preventDefault={handlePaste}
			placeholder="Контакты"
			bind:innerText={contacts}
			type="text"
			on:blur={() => {
				if (contacts !== '') {
					errors.contacts = checkContacts(contacts);
					if (!errors.contacts) contacts = normContacts(contacts);
				}
			}}
		/>
		{#if errors.contacts}
			<span class="failed">{errors.contacts}</span>
		{/if}
	</div>

	<button {disabled} class="button" type="submit">Обновить</button>
</form>

<style>
	div[role='textbox'] {
		width: 100%;
		outline: none;
		padding: 10px;
		border: 1px solid var(--color-10);
		border-radius: 10px;
	}
	div:empty:before {
		content: attr(placeholder);
		opacity: 0.5;
	}

	a {
		position: absolute;
		right: 0;
	}
</style>
