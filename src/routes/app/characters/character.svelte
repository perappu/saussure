<script lang="ts">
    import Spinner from '$lib/components/spinner/spinner.svelte';
    import { fetchMedia } from '$lib/data/media.svelte';
    import { settings } from '$lib/stores';
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';

    let { character } = $props();

    let loaded = $state(false);
    let src = $state('');

    onMount(async () => {
        src = await fetchMedia(
            get(settings).MEDIA_PATH + '/icons/' + character.icon
        );
        loaded = true;
    });
</script>

<div
    style="text-align: center; padding: 10px; width: 25%; max-width: 200px; border-radius: 5px; background-color: var(--background); margin: 5px;"
>
    <a href="{process.env.BASE_PATH}/app/characters/edit/{character.filename}">
        {#if loaded}
            <img
                {src}
                style="max-width: 100%; max-height: 200px;"
                alt={character.name}
                loading="lazy"
            />
        {:else}
            <Spinner />
        {/if}
        <div>{character.name}</div>
    </a>
    <small style="word-break: break-all;">{character.filename}</small>
</div>
