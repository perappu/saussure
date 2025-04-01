<script lang="ts">
	import { beforeNavigate, goto, invalidateAll } from "$app/navigation";
	import { Field, TextEditor } from "$lib/components";
	import Preview from "$lib/components/preview/preview.svelte";
	import { textValue } from "$lib/components/texteditor/texteditor";
	import {
		deleteCharacter,
		writeCharacter,
	} from "$lib/data/characters.svelte";
	import { renderCharacterPreview } from "$lib/frontends/previews.svelte";
	import { m } from "$lib/paraglide/messages";
	import { onMount } from "svelte";
	import type { PageProps } from "./$types";
	import { toast } from "@zerodevx/svelte-toast";

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
			theme: {
				"--toastColor": "mintcream",
				"--toastBackground": "rgba(62, 168, 106,0.9)",
				"--toastBarBackground": "#2F855A",
			},
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
				theme: {
					"--toastColor": "mintcream",
					"--toastBackground": "rgba(62, 168, 106,0.9)",
					"--toastBarBackground": "#2F855A",
				},
			});
			await invalidateAll();
			goto("/characters");
		}
	}

	function renderPreview() {
		var formData = new FormData(
			document.querySelector("#characterEdit") as HTMLFormElement,
		);
		formData.append("content", $textValue);
		preview = renderCharacterPreview(data.layouts, formData);
	}

	function onchange() {
		renderPreview();
	}

	onMount(() => renderPreview());

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
				onfocusout={() => renderPreview()}
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
