<script lang="ts">
    import { beforeNavigate, goto } from "$app/navigation";
    import { Field, TextEditor } from "$lib/components";
    import { textValue } from "$lib/components/texteditor/texteditor";
    import { toastConfig } from "$lib/config";
    import { writeCharacter } from "$lib/data/characters.svelte";
    import { writeLiterature } from "$lib/data/literatures.svelte";
    import { m } from "$lib/paraglide/messages";
    import { characters, literatures } from "$lib/stores";
    import { toast } from "@zerodevx/svelte-toast";

    let descriptionEditor: TextEditor | undefined;
    let numFields: any[] = $state([]);
    let confirmed: boolean = false;

    let filename = ($literatures.length ?? 0) + 1;

    async function submitLiterature() {
        let formData = new FormData(
            document.querySelector("#literatureEdit") as HTMLFormElement,
        );
        formData.append("content", $textValue);
        let result = await writeLiterature(filename + ".md", formData);
        confirmed = true;
        //todo: give user feedback that the file has been saved
        toast.push(m.toast_create_literature(), {
            theme: toastConfig.success,
            duration: 10000
        });
        goto("/app/literatures");
    }

    beforeNavigate(({ cancel }) => {
        if (!confirmed) {
            if (!confirm(m.are_you_sure())) {
                cancel();
            }
        }
    });
</script>

<form action="javascript:void(0);" id="literatureEdit">
    <input type="hidden" name="sha" />

    {m.character()}:
    <div class="characters">
        <select name="character" autocomplete="off">
            {#each $characters as option, index}
                <option value={option.filename.split('.')[0]}>{option.name}</option>
            {/each}
        </select>
    </div>

    <div class="form-group">
        {m.title()}:
        <input name="title" autocomplete="off" />
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

    {m.text()}:
    <TextEditor
        contents=""
        selectedTab="tiptap"
        bind:this={descriptionEditor}
    />

    <div style="text-align:right; margin: 5px;">
        <button onclick={submitLiterature}>{m.save()}</button>
    </div>
</form>
