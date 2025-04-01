<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import { characters, images } from "$lib/stores";
    
    export let passcondition:boolean;
    export let logout:boolean=true;
    export let redirect:string="/";
    
    onMount(async () => { if(browser && !passcondition) {
        if(logout) {
            // Cleanup what ever stores and databases you must
            characters.set([]);
            images.set([]);
            goto("/login");
        }
        else goto(redirect);        
    }});
    </script>
    
    {#if passcondition} <slot /> {/if}