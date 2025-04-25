<script lang="ts">
    import { beforeNavigate, goto } from "$app/navigation";
    import { Field, TextEditor } from "$lib/components";
    import { textValue } from "$lib/components/texteditor/texteditor";
    import { toastConfig } from "$lib/config";
    import { writeCharacter } from "$lib/data/characters.svelte";
    import { m } from "$lib/paraglide/messages";
    import { characters } from "$lib/stores";
    import { toast } from "@zerodevx/svelte-toast";
    import slugify from "slugify";

    let descriptionEditor: TextEditor | undefined;
    let numFields: any[] = $state([]);
    let confirmed: boolean = false;

    let filename = ($characters.length ?? 0) + 1;
    let name = $state('');

    async function submitCharacter() {
        let formData = new FormData(
            document.querySelector("#characterEdit") as HTMLFormElement,
        );
        formData.append("content", $textValue);
        let result = await writeCharacter(filename + "-" + slugify(name, '-') + ".md", formData);
        confirmed = true;
        //todo: give user feedback that the file has been saved
        toast.push(m.toast_create_character(), {
            theme: toastConfig.success,
            duration: 10000
        });
        goto("/app/characters");
    }

    beforeNavigate(({ cancel }) => {
        if (!confirmed) {
            if (!confirm(m.are_you_sure())) {
                cancel();
            }
        }
    });
</script>

<form action="javascript:void(0);" id="characterEdit" enctype="multipart/form-data">
    <input type="hidden" name="sha" />

    <div class="form-group">
        {m.icon()}:
        <input
            accept="image/png, image/jpeg, image/gif"
            id="icon"
            name="image"
            type="file"
        />
    </div>

    <div class="form-group">
        {m.name()}:
        <input name="name" autocomplete="off" bind:value={name} />
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
