<script lang="ts">
	import { TextEditor } from "$lib/components";
    import { textValue } from "$lib/components/texteditor";
    import { writeCharacter } from "$lib/data/characters.svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();

	let html;
	let descriptionEditor: TextEditor | undefined;

	async function submitCharacter() {
		var formData = new FormData(document.querySelector("#characterEdit") as HTMLFormElement);
		formData.append('description', $textValue)
		var result = await writeCharacter(data.filename, formData);
	}
</script>


<form action="javascript:void(0);" id="characterEdit">

<input type="hidden" name="sha" value={data.sha} />

<div class="form-group">
	Name:
	<input name="name" autocomplete="off" value={data.name} />
</div>

<div class="form-group">
	Tags:
	<input name="tags" autocomplete="off" value={data.tags} />
</div>

Fields:
{#each Object.keys(data.fields) as key, index}
	<div class="form-group">
		<div class="field">
			<input name="key{index}" autocomplete="off" value={key} />
			<input name="value{index}" autocomplete="off" value={data.fields[key]} />
			<button>x</button>
		</div>
	</div>
{/each}
<button style="width: 100%">Add Field</button>

Description:
<TextEditor selectedTab="tiptap" contents={data.contents} bind:this={descriptionEditor} />

<div style="text-align:right; margin: 5px;">
	<button onclick={submitCharacter}>Save</button>
</div>

</form>