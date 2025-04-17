<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import { m } from '$lib/paraglide/messages';
    import { get } from 'svelte/store';
    import Character from './character.svelte';
    import { characters, token } from '$lib/stores';

    //so we can do operations on it
    let order = $state(1);

    function sortName(multiplier: number) {
        if(order === 1) {
            order = -1
        } else {
            order = 1;
        }
        
        characters.set(get(characters).sort((a, b) => { 
            if (a.name > b.name) {
                return 1 * multiplier;
            }
            if (a.name < b.name) {
                return -1 * multiplier;
            } 
            return 0;
        }));
    }

</script>

<h2>{m.characters()}</h2>


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
    
    {#each $characters as character (character.filename)}
        <Character {character} />
        <hr>
    {/each}
    
    <a href="{process.env.BASE_PATH}/app/characters/create"><button style="width: 100%">{m.add_new_character()}</button></a>
    {:else}
    {m.warn_enter_settings()}
{/if}
