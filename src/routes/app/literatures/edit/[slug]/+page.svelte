<script lang="ts">
	import { beforeNavigate, goto, invalidateAll } from "$app/navigation";
	import { Field, TextEditor } from "$lib/components";
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
    import { characters, settings } from "$lib/stores";
    import { get } from "svelte/store";
    import { deleteLiterature, writeLiterature } from "$lib/data/literatures.svelte";

	let { data }: PageProps = $props();
	let descriptionEditor: TextEditor | undefined;
	let numFields: any[] = $state([]);
	let preview: string | undefined | null = $state("");
	let deleteCounter = 0;
	let confirmed = false;

	async function submitThis() {
		var formData = new FormData(
			document.querySelector("#literatureEdit") as HTMLFormElement,
		);
		formData.append("content", $textValue);
		var result = await writeLiterature(data.literature.filename, formData);
		//todo: give user feedback that the file has been saved
		toast.push(m.toast_edit_literature(), {
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
				document.querySelector("#literatureEdit") as HTMLFormElement,
			);
			var result = await deleteLiterature(
				data.literature.filename,
				formData,
			);
			toast.push(m.toast_delete_literature(), {
				theme: {
					"--toastColor": "mintcream",
					"--toastBackground": "rgba(62, 168, 106,0.9)",
					"--toastBarBackground": "#2F855A",
				},
			});
			await invalidateAll();
			goto("/app/literatures");
		}
	}

	function render() {
		var formData = new FormData(
			document.querySelector("#literatureEdit") as HTMLFormElement,
		);
		formData.append("content", $textValue);
		preview = renderPreview(data.layouts, get(settings).LITERATURE_LAYOUT, formData);
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

<h2>{m.edit_literature()} - {data.literature.title}</h2>

<div style="display: flex; justify-content: space-between;">
	<div style="width: 50%">
		<form action="javascript:void(0);" id="literatureEdit">
			<input type="hidden" name="sha" value={data.literature.sha} />

			{m.character()}:
			<div class="characters">
				<select name="character" autocomplete="off">
					{#each $characters as option, index}
						{#if option.filename.localeCompare(data.literature.character) == 0}
						<option value={option.filename} selected>{option.name}</option>
						{:else}
						<option value={option.filename}>{option.name}</option>
						{/if}
					{/each}
				</select>
			</div>

			<div class="form-group">
				{m.title()}:
				<input
					name="title"
					autocomplete="off"
					value={data.literature.title}
					{onchange}
				/>
			</div>

			<div class="form-group">
				{m.tags()}:
				<input
					name="tags"
					autocomplete="off"
					value={data.literature.tags}
					{onchange}
				/>
			</div>

			{m.fields()}:
			<!--existing fields-->
			{#each Object.keys(data.literature.fields) as key, index}
				<Field
					{index}
					{key}
					value={data.literature.fields[key]}
					{onchange}
				/>
			{/each}
			<!--new fields-->
			{#each numFields as f, index}
				<Field
					index={index + Object.keys(data.literature.fields).length}
					{onchange}
				/>
			{/each}
			<button
				style="width: 100%"
				onclick={() =>
					(numFields = [...numFields, { key: "", value: "" }])}
				>{m.add_field()}</button
			>

			{m.text()}:
			<TextEditor
				selectedTab="tiptap"
				contents={data.literature.contents}
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
