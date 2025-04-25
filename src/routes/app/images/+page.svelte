<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import { m } from '$lib/paraglide/messages';
    import { get } from 'svelte/store';
    import Image from './image.svelte';
    import { characters, images, token } from '$lib/stores';

    //so we can do operations on it
    let order = $state(1);

    function sortName(multiplier: number) {
        if(order === 1) {
            order = -1
        } else {
            order = 1;
        }
        
        images.set(get(images).sort((a, b) => { 
            //sort by character name first
            if (a.characterName > b.characterName) {
                return 1 * multiplier;
            }
            if (a.characterName < b.characterName) {
                return -1 * multiplier;
            } 

            //sort by title second
            if (a.title > b.title) {
                return 1 * multiplier;
            }
            if (a.title < b.title) {
                return -1 * multiplier;
            } 

            return 0;
        }));
    }

</script>

<h2>{m.images()}</h2>


{#if $token != null && $token != ""}
<div style="text-align: right;">
    <button onclick={() => {sortName(order)}}>
        {m.sort_alphabetical()}
        {#if order == 1}
        ↓
        {:else}
        ↑
        {/if}
    </button>
    <button onclick={async () => {await invalidateAll()}}>
        {m.refresh_list()}
    </button>
    </div>
    
    <div style="display: flex; flex-direction: row; flex-wrap: wrap;">
    {#each $images as image (image.filename)}
        <Image {image} />
    {/each}
    </div>
    
    <a href="{process.env.BASE_PATH}/app/images/create"><button style="width: 100%">{m.add_new_image()}</button></a>
    {:else}
    {m.warn_enter_settings()}
{/if}
