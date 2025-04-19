<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import { m } from '$lib/paraglide/messages';
    import { get } from 'svelte/store';
    import Literature from './literature.svelte';
    import { literatures, token } from '$lib/stores';

    //so we can do operations on it
    let order = $state(1);

    function sortName(multiplier: number) {
        if(order === 1) {
            order = -1
        } else {
            order = 1;
        }
        
        literatures.set(get(literatures).sort((a, b) => { 
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

<h2>{m.literatures()}</h2>

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
    
    {#each $literatures as literature (literature.filename)}
        <Literature {literature} />
        <hr>
    {/each}
    
    <a href="{process.env.BASE_PATH}/app/literatures/create"><button style="width: 100%">{m.add_new_literature()}</button></a>
    {:else}
    {m.warn_enter_settings()}
{/if}
