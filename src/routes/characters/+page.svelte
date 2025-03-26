<script lang="ts">
    import { m } from '$lib/paraglide/messages';
    import type { LayoutProps } from '../$types';
    import Character from './character.svelte';

	let { data }: LayoutProps = $props();

    //so we can do operations on it
    let characters = $state(data.characters!);
    let order = $state(1);

    function sortName(multiplier: number) {
        if(order === 1) {
            order = -1
        } else {
            order = 1;
        }

        characters.sort((a,b) => { 
            if (a.name > b.name) {
                return 1 * multiplier;
            }
            if (a.name < b.name) {
                return -1 * multiplier;
            } 
            return 0;
        })
    }

</script>

<h2>{m.characters()}</h2>


{#if localStorage.getItem("SETTINGS") && JSON.parse(localStorage.getItem("SETTINGS")!).TOKEN}
<div style="text-align: right;">
    <button onclick={() => {sortName(order)}}>
        {m.sort_alphabetical()}
        {#if order == 1}
        ↓
        {:else}
        ↑
        {/if}
        
    </button>
    </div>
    
    {#each characters as character (character)}
        <Character {character} />
        <hr>
    {/each}
    
    <a href="/characters/create"><button style="width: 100%">{m.add_new_character()}</button></a>
    {:else}
    {m.warn_enter_settings()}
{/if}
