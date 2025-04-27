<script lang="ts">
    import { beforeNavigate, goto } from '$app/navigation';
    import { Field, TextEditor } from '$lib/components';
    import { textValue } from '$lib/components/texteditor/texteditor';
    import { toastConfig } from '$lib/config';
    import { writeImage } from '$lib/data/images.svelte';
    import { m } from '$lib/paraglide/messages';
    import { characters, images } from '$lib/stores';
    import { toast } from '@zerodevx/svelte-toast';
    import slugify from 'slugify';
    import Svelecte from 'svelecte';

    let descriptionEditor: TextEditor | undefined;
    let numFields: any[] = $state([]);
    let confirmed: boolean = false;

    let filename = ($images.length ?? 0) + 1;

    let characterList: { id: any; name: any; }[] = [];
    $characters.forEach(c => {
        characterList.push({id: c.filename.split('.')[0], name: c.name });
    });
    let selectedCharacters: any[] = $state([]);

    async function submitImage() {
        let formData = new FormData(
            document.querySelector('#imageCreate') as HTMLFormElement
        );
        formData.append('content', $textValue);
        formData.append('characters', selectedCharacters.toString());
        let result = await writeImage(
            filename +
                '-' +
                slugify(
                    (document.getElementById('image')! as HTMLFormElement).value
                        .split('\\')
                        .pop(),
                    { replacement: '-', lower: true }
                ),
            formData
        );
        confirmed = true;
        toast.push(m.toast_create_image(), {
            theme: toastConfig.success,
            duration: 10000
        });
        goto('/app/images');
    }

    beforeNavigate(({ cancel }) => {
        if (!confirmed) {
            if (!confirm(m.are_you_sure())) {
                cancel();
            }
        }
    });
</script>

<form
    action="javascript:void(0);"
    id="imageCreate"
    enctype="multipart/form-data"
>
    <input type="hidden" name="sha" />

    {m.character()}:
    <div class="characters">
        <Svelecte options={characterList} multiple bind:value={selectedCharacters} />
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
