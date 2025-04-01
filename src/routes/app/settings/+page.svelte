<script lang="ts">
	import { setConfigEleventy, settings } from "$lib/config";
	import { get } from "svelte/store";
	import type { PageProps } from "./$types";
	import { m } from "$lib/paraglide/messages";
	import { onMount } from "svelte";

	let changes = get(settings);

	function toggleFrontend() {
		(document.getElementById(
			"layouts_directory",
		) as HTMLInputElement)!.disabled = !(document.getElementById(
			"layouts_directory",
		) as HTMLInputElement)!.disabled;
		(document.getElementById("base_layout") as HTMLInputElement)!.disabled =
			!(document.getElementById("base_layout") as HTMLInputElement)!
				.disabled;
		(document.getElementById(
			"character_layout",
		) as HTMLInputElement)!.disabled = !(document.getElementById(
			"character_layout",
		) as HTMLInputElement)!.disabled;
		(document.getElementById(
			"image_layout",
		) as HTMLInputElement)!.disabled = !(document.getElementById(
			"image_layout",
		) as HTMLInputElement)!.disabled;
		(document.getElementById(
			"literature_layout",
		) as HTMLInputElement)!.disabled = !(document.getElementById(
			"literature_layout",
		) as HTMLInputElement)!.disabled;
		(document.getElementById(
			"character_directory",
		) as HTMLInputElement)!.disabled = !(document.getElementById(
			"character_directory",
		) as HTMLInputElement)!.disabled;
		(document.getElementById(
			"image_directory",
		) as HTMLInputElement)!.disabled = !(document.getElementById(
			"image_directory",
		) as HTMLInputElement)!.disabled;
		(document.getElementById(
			"literature_directory",
		) as HTMLInputElement)!.disabled = !(document.getElementById(
			"literature_directory",
		) as HTMLInputElement)!.disabled;
	}

	onMount(() => {
		if ($settings.FRONTEND !== "custom") {
			toggleFrontend();
		}
	});

	const onchange = () => {
		settings.set(changes);

		if ($settings.FRONTEND === "11ty") {
			setConfigEleventy();
			toggleFrontend();
		} else {
			toggleFrontend();
		}
	};
</script>

<h2>{m.settings()}</h2>

<div class="settings">
	<label>
		{m.theme()}:
		<select
			name="theme"
			autocomplete="off"
			bind:value={$settings.THEME}
			{onchange}
		>
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
			{onchange}
		>
			<option value="enabled">Enabled</option>
			<option value="disabled">Disabled</option>
		</select>
	</label>

	<hr />

	<label>
		{m.backend()}:
		<select
			name="backend"
			autocomplete="off"
			bind:value={$settings.BACKEND}
			{onchange}
		>
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

	<hr />

	<label>
		{m.frontend()}:
		<select
			name="frontend"
			autocomplete="off"
			bind:value={$settings.FRONTEND}
			{onchange}
		>
			<option value="11ty">11ty</option>
			<option value="custom">Custom</option>
		</select>
	</label>

	({m.forward_slash()})

	<br />
	<label>
		Layouts Directory:
		<input
			id="layouts_directory"
			name="layouts_directory"
			autocomplete="off"
			bind:value={$settings.LAYOUT_DIRECTORY}
			{onchange}
		/>
	</label>
	<label>
		Base Layout Filename:
		<input
			id="base_layout"
			name="base_layout"
			autocomplete="off"
			bind:value={$settings.BASE_LAYOUT}
			{onchange}
		/>
	</label>
	<label>
		Character Layout Filename:
		<input
			id="character_layout"
			name="character_layout"
			autocomplete="off"
			bind:value={$settings.CHARACTER_LAYOUT}
			{onchange}
		/>
	</label>
	<label>
		Image Layout Filename:
		<input
			id="image_layout"
			name="image_layout"
			autocomplete="off"
			bind:value={$settings.IMAGE_LAYOUT}
			{onchange}
		/>
	</label>
	<label>
		Literature Layout Filename:
		<input
			id="literature_layout"
			name="literature_layout"
			autocomplete="off"
			bind:value={$settings.LITERATURE_LAYOUT}
			{onchange}
		/>
	</label>
	<br />
	<label>
		Character Directory:
		<input
			id="character_directory"
			name="character_directory"
			autocomplete="off"
			bind:value={$settings.CHARACTER_DIRECTORY}
			{onchange}
		/>
	</label>
	<br />
	<label>
		Image Directory:
		<input
			id="image_directory"
			name="image_directory"
			autocomplete="off"
			bind:value={$settings.IMAGE_DIRECTORY}
			{onchange}
		/>
	</label>
	<br />
	<label>
		Literature Directory:
		<input
			id="literature_directory"
			name="literature_directory"
			autocomplete="off"
			bind:value={$settings.LITERATURE_DIRECTORY}
			{onchange}
		/>
	</label>
	<br />

	<hr />
	<label>
		{m.media_path()}:
		<input
			name="media_path"
			autocomplete="off"
			bind:value={$settings.MEDIA_PATH}
			{onchange}
		/>
	</label>

</div>
