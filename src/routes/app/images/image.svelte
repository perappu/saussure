<script lang="ts">
    import Spinner from '$lib/components/spinner/spinner.svelte';
    import { fetchMedia } from '$lib/data/media.svelte';
    import { settings } from '$lib/stores';
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';

    let { image } = $props();

    let loaded = $state(false);
    let src = $state('');

    $effect(() => {
        loaded = false;
        fetchMedia(get(settings).MEDIA_PATH + '/' + image.filename).then(
            (img) => {
                src = img;
                loaded = true;
            }
        );
    });
</script>

<div
    style="text-align: center; padding: 10px; width: 25%; max-width: 200px; border-radius: 5px; background-color: var(--background); margin: 5px;"
>
    <a href="{process.env.BASE_PATH}/app/images/edit/{image.filename}">
        {#if loaded}
            <img
                {src}
                style="max-width: 100%; max-height: 200px;"
                alt={image.title}
				loading=lazy
            />
        {/if}
    </a>
    <div>{image.characterName}</div>

    <div>
        <a href="{process.env.BASE_PATH}/app/images/edit/{image.filename}"
            >{image.title ? image.title : '(no title)'}</a
        >
    </div>

    <small style="word-break: break-all;">{image.filename}</small>
</div>
