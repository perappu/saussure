<script lang="ts">
	import { beforeNavigate } from "$app/navigation";
	import { Field, TextEditor } from "$lib/components";
    import Preview from "$lib/components/preview/preview.svelte";
	import { textValue } from "$lib/components/texteditor/texteditor";
	import { writeCharacter } from "$lib/data/characters.svelte";
	import { renderCharacterPreview } from "$lib/frontends/previews.svelte";
	import { m } from "$lib/paraglide/messages";
    import { onMount } from "svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
	let descriptionEditor: TextEditor | undefined;
	let numFields: any[] = $state([]);
	let preview: string | undefined | null = $state("");

	async function submitCharacter() {
		var formData = new FormData(
			document.querySelector("#characterEdit") as HTMLFormElement,
		);
		formData.append("content", $textValue);
		var result = await writeCharacter(data.character.filename, formData);
		//todo: give user feedback that the file has been saved
	}

	async function renderPreview() {
		var formData = new FormData(
			document.querySelector("#characterEdit") as HTMLFormElement,
		);
		formData.append("content", $textValue);
		preview = await renderCharacterPreview(data.layouts, formData);
	}

	async function onchange() {
		await renderPreview();
	}

	onMount(async () => await renderPreview());

    beforeNavigate(({ cancel }) => {
		if (!confirm('Are you sure you want to leave this page? You may have unsaved changes that will be lost.')) {
		cancel();
		}
	});
</script>

<h2>{m.edit_character()} - {data.character.name}</h2>

<div style="display: flex; justify-content: space-between;">
	<div style="width: 50%">
		<form action="javascript:void(0);" id="characterEdit">
			<input type="hidden" name="sha" value={data.character.sha} />

			<div class="form-group">
				{m.name()}:
				<input
					name="name"
					autocomplete="off"
					value={data.character.name}
					{onchange}
				/>
			</div>

			<div class="form-group">
				{m.tags()}:
				<input
					name="tags"
					autocomplete="off"
					value={data.character.tags}
					{onchange}
				/>
			</div>

			{m.fields()}:
			<!--existing fields-->
			{#each Object.keys(data.character.fields) as key, index}
				<Field {index} {key} value={data.character.fields[key]} {onchange}/>
			{/each}
			<!--new fields-->
			{#each numFields as f, index}
				<Field
					index={index + Object.keys(data.character.fields).length}
					{onchange}
				/>
			{/each}
			<button
				style="width: 100%"
				onclick={() =>
					(numFields = [...numFields, { key: "", value: "" }])}
				>{m.add_field()}</button
			>

			{m.description()}:
			<TextEditor
				selectedTab="tiptap"
				contents={data.character.contents}
				bind:this={descriptionEditor}
				onfocusout={() => renderPreview()}
			/>

			<div style="text-align:right; margin: 5px;">
				<button onclick={submitCharacter}>{m.save()}</button>
			</div>
		</form>
	</div>

	<div style="width: 45%;">
		<Preview html={preview} />
	</div>
</div>
