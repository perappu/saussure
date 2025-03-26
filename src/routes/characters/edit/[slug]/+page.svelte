<script lang="ts">
	import { TextEditor } from "$lib/components";
	import { textValue } from "$lib/components/texteditor/texteditor";
	import { writeCharacter } from "$lib/data/characters.svelte";
    import { m } from "$lib/paraglide/messages";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
	let descriptionEditor: TextEditor | undefined;

	async function submitCharacter() {
		var formData = new FormData(
			document.querySelector("#characterEdit") as HTMLFormElement,
		);
		formData.append("description", $textValue);
		var result = await writeCharacter(data.filename, formData);
		//todo: give user feedback that the file has been saved
	}
</script>

<form action="javascript:void(0);" id="characterEdit">
	<input type="hidden" name="sha" value={data.sha} />

	<div class="form-group">
		{m.name()}:
		<input name="name" autocomplete="off" value={data.name} />
	</div>

	<div class="form-group">
		{m.tags()}:
		<input name="tags" autocomplete="off" value={data.tags} />
	</div>

	{m.fields()}:
	{#each Object.keys(data.fields) as key, index}
		<div class="form-group">
			<div class="field">
				<input name="key{index}" autocomplete="off" value={key} />
				<input
					name="value{index}"
					autocomplete="off"
					value={data.fields[key]}
				/>
				<button>x</button>
			</div>
		</div>
	{/each}
	<button style="width: 100%">{m.add_field()}</button>

	{m.description()}:
	<TextEditor
		selectedTab="tiptap"
		contents={data.contents}
		bind:this={descriptionEditor}
	/>

	<div style="text-align:right; margin: 5px;">
		<button onclick={submitCharacter}>{m.save()}</button>
	</div>
</form>
