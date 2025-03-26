<script lang="ts">
    import { beforeNavigate, goto } from "$app/navigation";
    import { Field, TextEditor } from "$lib/components";
    import { textValue } from "$lib/components/texteditor/texteditor";
    import { writeCharacter } from "$lib/data/characters.svelte";
    import { m } from "$lib/paraglide/messages";
    import type { LayoutProps } from "../../$types";

    let { data }: LayoutProps = $props();
    let descriptionEditor: TextEditor | undefined;
    let numFields: any[] = $state([]);
    let confirmed: boolean = false;

    let filename = (data.characters?.length ?? 0) + 1;

    async function submitCharacter() {
        let formData = new FormData(
            document.querySelector("#characterEdit") as HTMLFormElement,
        );
        formData.append("content", $textValue);
        let result = await writeCharacter(filename + ".md", formData);
        confirmed = true;
        //todo: give user feedback that the file has been saved
        goto("/characters");
    }

    beforeNavigate(({ cancel }) => {
        if(!confirmed) {
            if (!confirm('Are you sure you want to leave this page? You may have unsaved changes that will be lost.')) {
            cancel();
            }
        }
	});
</script>

<form action="javascript:void(0);" id="characterEdit">
    <input type="hidden" name="sha" />

    <div class="form-group">
        {m.name()}:
        <input name="name" autocomplete="off" />
    </div>

    <div class="form-group">
        {m.tags()}:
        <input name="tags" autocomplete="off" />
    </div>

    {m.fields()}:
    <div class="fields">
        {#each numFields as f, index}
            <Field {index} />
        {/each}
    </div>

    <button style="width: 100%" onclick={() => (numFields = [...numFields, 1])}
        >{m.add_field()}</button
    >

    {m.description()}:
    <TextEditor
        contents=""
        selectedTab="tiptap"
        bind:this={descriptionEditor}
    />

    <div style="text-align:right; margin: 5px;">
        <button onclick={submitCharacter}>{m.save()}</button>
    </div>
</form>
