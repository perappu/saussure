<script lang="ts">
    import { settings } from '$lib/settings/index.svelte';
    import { get } from 'svelte/store';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let changes = get(settings);

	const onchange = () => {
		settings.set(changes);
	}

</script>

<div class="settings">

<label>
	Theme:
	<select 
		name="theme"
		autocomplete="off"
		bind:value={$settings.THEME}
		{onchange}>
		<option value="light">Light</option>
		<option value="dark">Dark</option>
	  </select>
</label>

<label>
	WYSIWYG Editor:
	<select 
		name="wysiwyg"
		autocomplete="off"
		bind:value={$settings.WYSIWYG}
		{onchange}>
		<option value="enabled">Enabled</option>
		<option value="disabled">Disabled</option>
	  </select>
</label>

<hr>

<label>
	Backend:
	<select 
		name="backend"
		autocomplete="off"
		bind:value={$settings.BACKEND}
		{onchange}>
		<option value="github">GitHub</option>
		<option value="forgejo">Forgejo/Gitea</option>
	  </select>
</label>

<label>
	API Token:
	<input
		name="token"
		autocomplete="off"
		bind:value={$settings.TOKEN}
		{onchange}
	/>
</label>

<label>
	Repo Name:
	<input
		name="repo_name"
		autocomplete="off"
		bind:value={$settings.REPO_NAME}
		{onchange}
	/>
</label>

<label>
	Owner Name:
	<input
		name="owner_name"
		autocomplete="off"
		bind:value={$settings.OWNER_NAME}
		{onchange}
	/>
</label>

<label>
	Branch:
	<input
		name="repo_name"
		autocomplete="off"
		bind:value={$settings.BRANCH}
		{onchange}
	/>
</label>

<hr>

<label>
	Frontend:
	<select 
		name="frontend"
		autocomplete="off"
		bind:value={$settings.FRONTEND}
		{onchange}>
		<option value="11ty">11ty</option>
		<option value="custom">Custom</option>
	  </select>
</label>

{#if $settings.FRONTEND == "custom"}
<label>
	Character Directory:
	<input
		name="character_directory"
		autocomplete="off"
		bind:value={$settings.CHARACTER_DIRECTORY}
		{onchange}
	/>
</label>
<label>
	Gallery Directory:
	<input
		name="gallery_directory"
		autocomplete="off"
		bind:value={$settings.GALLERY_DIRECTORY}
		{onchange}
	/>
</label>
<label>
	Image Directory:
	<input
		name="image_directory"
		autocomplete="off"
		bind:value={$settings.IMAGE_DIRECTORY}
		{onchange}
	/>
</label>
<label>
	Literature Directory:
	<input
		name="literature_directory"
		autocomplete="off"
		bind:value={$settings.LITERATURE_DIRECTORY}
		{onchange}
	/>
</label>
{/if}

<hr>

<label>
	Media Storage:
	<select 
		name="media_storage"
		autocomplete="off"
		bind:value={$settings.MEDIA_STORAGE}
		{onchange}>
		<option value="local">Local</option>
		<option value="S3">S3</option>
	  </select>
</label>
</div>