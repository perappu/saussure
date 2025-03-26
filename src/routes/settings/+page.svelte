<script lang="ts">
    import { settings } from "$lib/config";
    import { get } from 'svelte/store';
	import type { PageProps } from './$types';
    import { m } from "$lib/paraglide/messages";

	let changes = get(settings);

	const onchange = () => {
		settings.set(changes);
	}

</script>

<h2>{m.settings()}</h2>

<div class="settings">

<label>
	{m.theme()}:
	<select 
		name="theme"
		autocomplete="off"
		bind:value={$settings.THEME}
		{onchange}>
		<option value="light">{m.light()}</option>
		<option value="dark">{m.dark()}</option>
	  </select>
</label>

<label>
	{m.wysiwyg_editor()}:
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
	{m.backend()}:
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
	{m.api_token()}:
	<input
		name="token"
		autocomplete="off"
		bind:value={$settings.TOKEN}
		{onchange}
	/>
</label>

<label>
	{m.repo_name()}:
	<input
		name="repo_name"
		autocomplete="off"
		bind:value={$settings.REPO_NAME}
		{onchange}
	/>
</label>

<label>
	{m.owner_name()}:
	<input
		name="owner_name"
		autocomplete="off"
		bind:value={$settings.OWNER_NAME}
		{onchange}
	/>
</label>

<label>
	{m.branch()}:
	<input
		name="repo_name"
		autocomplete="off"
		bind:value={$settings.BRANCH}
		{onchange}
	/>
</label>

<hr>

<label>
	{m.frontend()}:
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

<label>
	Layouts Directory:
	<input
		name="layouts_directory"
		autocomplete="off"
		bind:value={$settings.LAYOUT_DIRECTORY}
		{onchange}
	/>
</label>
{/if}

<hr>

<label>
	{m.media_storage()}:
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