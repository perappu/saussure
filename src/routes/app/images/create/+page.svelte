<script lang="ts">
    import { beforeNavigate, goto } from "$app/navigation";
    import { Field, TextEditor } from "$lib/components";
    import { textValue } from "$lib/components/texteditor/texteditor";
    import { writeImage } from "$lib/data/images.svelte";
    import { m } from "$lib/paraglide/messages";
    import { characters, images } from "$lib/stores";
    import { toast } from "@zerodevx/svelte-toast";

    let descriptionEditor: TextEditor | undefined;
    let numFields: any[] = $state([]);
    let confirmed: boolean = false;

    let filename = ($images.length ?? 0) + 1;

    async function submitImage() {
        let formData = new FormData(
            document.querySelector("#imageCreate") as HTMLFormElement,
        );
        formData.append("content", $textValue);
        let result = await writeImage(
            filename +
                "-" +
                (document.getElementById("image")! as HTMLFormElement).value
                    .split("\\")
                    .pop(),
            formData,
        );
        confirmed = true;
        toast.push(m.toast_create_image(), {
            theme: {
                "--toastColor": "mintcream",
                "--toastBackground": "rgba(62, 168, 106,0.9)",
                "--toastBarBackground": "#2F855A",
                "--toastWidth": "23rem",
                "--toastContainerLeft": "calc(50vw - 23rem)",
            },
            duration: 10000,
        });
        goto("/app/images");
    }

    beforeNavigate(({ cancel }) => {
        if (!confirmed) {
            if (!confirm(m.are_you_sure())) {
                cancel();
            }
        }
    });
</script>

<form action="javascript:void(0);" id="imageCreate" enctype="multipart/form-data">
    <input type="hidden" name="sha" />

    {m.character()}:
    <div class="characters">
        <select name="character" autocomplete="off">
            {#each $characters as option, index}
                <option value={option.filename}>{option.name}</option>
            {/each}
        </select>
    </div>

    <div class="form-group">
        {m.file()}:
        <input
            accept="image/png, image/jpeg, image/gif"
            id="image"
            name="image"
            type="file"
        />
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

    {m.description()}:
    <TextEditor
        contents=""
        selectedTab="tiptap"
        bind:this={descriptionEditor}
    />

    <div style="text-align:right; margin: 5px;">
        <button onclick={submitImage}>{m.save()}</button>
    </div>
</form>
