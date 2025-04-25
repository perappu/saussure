<script lang="ts">
	import { beforeNavigate, goto, invalidateAll } from "$app/navigation";
	import { Field, TextEditor, UploadImage } from "$lib/components";
	import Preview from "$lib/components/preview/preview.svelte";
	import { textValue } from "$lib/components/texteditor/texteditor";
	import {
		deleteCharacter,
		writeCharacter,
	} from "$lib/data/characters.svelte";
	import { renderPreview } from "$lib/frontends/previews.svelte";
	import { m } from "$lib/paraglide/messages";
	import { onMount } from "svelte";
	import type { PageProps } from "./$types";
	import { toast } from "@zerodevx/svelte-toast";
    import { settings } from "$lib/stores";
    import { get } from "svelte/store";
    import { toastConfig } from "$lib/config";

	let { data }: PageProps = $props();
	let descriptionEditor: TextEditor | undefined;
	let numFields: any[] = $state([]);
	let preview: string | undefined | null = $state("");
	let deleteCounter = 0;
	let confirmed = false;

	async function submitThis() {
		var formData = new FormData(
			document.querySelector("#characterEdit") as HTMLFormElement,
		);
		formData.append("content", $textValue);
		var result = await writeCharacter(data.character.filename, formData);
		//todo: give user feedback that the file has been saved
		toast.push(m.toast_edit_character(), {
			theme: toastConfig.success,
		});
		await invalidateAll();
	}

	async function deleteThis() {
		if (deleteCounter === 0) {
			document.getElementById("delete")!.innerHTML = "Are you sure?";
			deleteCounter++;
		} else if (deleteCounter === 1) {
			document.getElementById("delete")!.innerHTML = "Really sure?";
			deleteCounter++;
		} else if (deleteCounter > 1) {
			confirmed = true;
			document.getElementById("delete")!.innerHTML = "Deleting...";
			var formData = new FormData(
				document.querySelector("#characterEdit") as HTMLFormElement,
			);
			var result = await deleteCharacter(
				data.character.filename,
				formData,
			);
			toast.push(m.toast_delete_character(), {
				theme: toastConfig.success,
			});
			await invalidateAll();
			goto("/app/characters");
		}
	}

	function render() {
		var formData = new FormData(
			document.querySelector("#characterEdit") as HTMLFormElement,
		);
		formData.append("content", $textValue);
		preview = renderPreview(data.layouts, get(settings).CHARACTER_LAYOUT, formData);
	}

	function onchange() {
		render();
	}

	onMount(() => render());

	beforeNavigate(({ cancel }) => {
		if (confirmed == false) {
			if (!confirm(m.are_you_sure())) {
				cancel();
			}
		}
	});
</script>

<h2>{m.edit_character()} - {data.character.name}</h2>

<div style="display: flex; justify-content: space-between;">
	<div style="width: 50%">
		
		<form action="javascript:void(0);" id="characterEdit" enctype="multipart/form-data">
			<input type="hidden" name="sha" value={data.character.sha} />
			<input type="hidden" name="icon" value={data.character.icon} />

			{m.icon()}:
			<UploadImage filename={data.character.icon} path='icons' height={100} />

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
				<Field
					{index}
					{key}
					value={data.character.fields[key]}
					{onchange}
				/>
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
				onfocusout={() => render()}
			/>

			<div style="text-align:right; margin: 5px;">
				<button onclick={submitThis}>{m.save()}</button>
			</div>
			<div style="text-align:right; margin: 5px;">
				<button id="delete" class="danger" onclick={deleteThis}
					>{m.delete()}</button
				>
			</div>
		</form>
	</div>

	<div style="width: 48%;">
		<Preview html={preview} />
	</div>
</div>
