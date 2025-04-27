<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import { m } from '$lib/paraglide/messages';
    import { get } from 'svelte/store';
    import Image from './image.svelte';
    import { characters, images, token } from '$lib/stores';
    import { Pagination } from '$lib/components';

    //so we can do operations on it
    let order = $state(1);
    let selectedCharacter = $state('');
    let filteredImages = $state(get(images));
    let trimmedImages = $state([] as Image[]);

    function filterCharacter() {
        console.log(selectedCharacter);
        if (selectedCharacter) {
            filteredImages = get(images).filter(
                (image: any) => image.character.includes(selectedCharacter.split('.')[0]));
        } else {
            filteredImages = get(images);
        }
    }

    function sortName(multiplier: number) {
        if (order === 1) {
            order = -1;
        } else {
            order = 1;
        }

        filteredImages = filteredImages.sort((a, b) => {
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
        });
    }
</script>

<h2>{m.images()}</h2>

{#if $token != null && $token != ''}
    <div style="display: flex;justify-content: flex-end;">
        <select
            name="selectedCharacter"
            autocomplete="on"
            bind:value={selectedCharacter}
            onchange={() => {
                filterCharacter();
            }}
        >
            <option selected={true} value="">All</option>
            {#each $characters as character (character.filename)}
                <option value={character.filename}>{character.name}</option>
            {/each}
        </select>

        <button
            onclick={() => {
                sortName(order);
            }}
        >
            {m.sort_alphabetical()}
            {#if order == 1}
                ↓
            {:else}
                ↑
            {/if}
        </button>
        <button
            onclick={async () => {
                await invalidateAll();
            }}
        >
            {m.refresh_list()}
        </button>
    </div>
    <a href="{process.env.BASE_PATH}/app/images/create"><button style="width: 100%">{m.add_new_image()}</button></a>

    <div style="display: flex; flex-direction: row; flex-wrap: wrap;">
        {#each trimmedImages as image}
            <Image {image} />
        {/each}
    </div>

    <Pagination rows={filteredImages} perPage={30} bind:trimmedRows={trimmedImages} />

{:else}
    {m.warn_enter_settings()}
{/if}
