<script lang="ts">
    import { beforeNavigate, goto, invalidateAll } from '$app/navigation';
    import { Field, UploadImage, TextEditor } from '$lib/components';
    import { textValue } from '$lib/components/texteditor/texteditor';
    import { m } from '$lib/paraglide/messages';
    import type { PageProps } from './$types';
    import { toast } from '@zerodevx/svelte-toast';
    import { deleteImage, writeImage } from '$lib/data/images.svelte';
    import { characters } from '$lib/stores';
    import { toastConfig } from '$lib/config';
    import Svelecte from 'svelecte';

    let { data }: PageProps = $props();
    let descriptionEditor: TextEditor | undefined;
    let numFields: any[] = $state([]);
    let preview: string | undefined | null = $state('');
    let deleteCounter = 0;
    let confirmed = false;

    let characterList: { id: any; name: any; }[] = [];
    $characters.forEach(c => {
        characterList.push({id: c.filename.split('.')[0], name: c.name });
    });
    let selectedCharacters: any[] = $state(data.image.character);

    async function submitThis() {
        var formData = new FormData(
            document.querySelector('#imageEdit') as HTMLFormElement
        );
        formData.append('content', $textValue);
        formData.append('characters', selectedCharacters.toString());
        var result = await writeImage(data.image.filename, formData);
        if (result == true) {
            //todo: give user feedback that the file has been saved
            toast.push(m.toast_edit_image(), {
                theme: toastConfig.success
            });
        } else {
            toast.push(m.toast_error(), {
                theme: toastConfig.fail
            });
        }
        await invalidateAll();
    }

    async function deleteThis() {
        if (deleteCounter === 0) {
            document.getElementById('delete')!.innerHTML = 'Are you sure?';
            deleteCounter++;
        } else if (deleteCounter === 1) {
            document.getElementById('delete')!.innerHTML = 'Really sure?';
            deleteCounter++;
        } else if (deleteCounter > 1) {
            confirmed = true;
            document.getElementById('delete')!.innerHTML = 'Deleting...';
            var formData = new FormData(
                document.querySelector('#imageEdit') as HTMLFormElement
            );
            var result = await deleteImage(data.image.filename, formData);
            toast.push(m.toast_delete_image(), {
                theme: toastConfig.success
            });
            await invalidateAll();
            goto('/app/images');
        }
    }

    beforeNavigate(({ cancel }) => {
        if (confirmed == false) {
            if (!confirm(m.are_you_sure())) {
                cancel();
            }
        }
    });
</script>

<h2>{m.edit_image()} - {data.image.title}</h2>

<h3>Reupload Image</h3>

<div style="display: flex; justify-content: space-between;">
    <div style="width: 100%">
        <form
            action="javascript:void(0);"
            id="imageEdit"
            enctype="multipart/form-data"
        >
            <input type="hidden" name="sha" value={data.image.sha} />

            <UploadImage filename={data.image.filename} path='' />

            {m.character()}:
            <div class="characters">
                <Svelecte options={characterList} multiple bind:value={selectedCharacters} />
            </div>

            <div class="form-group">
                {m.title()}:
                <input
                    name="title"
                    autocomplete="off"
                    value={data.image.title}
                />
            </div>

            <div class="form-group">
                {m.tags()}:
                <input
                    name="tags"
                    autocomplete="off"
                    value={data.image.tags}
                />
            </div>

            {m.fields()}:
            <!--existing fields-->
            {#each Object.keys(data.image.fields) as key, index}
                <Field
                    {index}
                    {key}
                    value={data.image.fields[key]}
                />
            {/each}
            <!--new fields-->
            {#each numFields as f, index}
                <Field
                    index={index + Object.keys(data.image.fields).length}
                />
            {/each}
            <button
                style="width: 100%"
                onclick={() =>
                    (numFields = [...numFields, { key: '', value: '' }])}
                >{m.add_field()}</button
            >

            {m.description()}:
            <TextEditor
                selectedTab="tiptap"
                contents={data.image.contents}
                bind:this={descriptionEditor}
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
</div>
