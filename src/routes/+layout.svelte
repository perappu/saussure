<script lang="ts">
    import { settings } from "$lib/settings/index.svelte";
    import { navigating } from "$app/state";
    import { get } from "svelte/store";
    let { children } = $props();
</script>

<svelte:head>
    {#if $settings.THEME == "light"}
        <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/water.css@2/out/light.css"
        />
    {:else}
        <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css"
        />
    {/if}
</svelte:head>

<header>
    <nav>
        <a href="/">Dashboard</a>
        <a href="/characters">Characters</a>
        <a href="/galleries">Galleries</a>
        <a href="/images">Images</a>
        <a href="/literatures">Literatures</a>
        <a href="/settings">Settings</a>
    </nav>
</header>

<main class="container">
    {#if navigating.to}
        <div aria-busy="true">Loading...</div>
    {:else}
        {@render children()}
    {/if}
</main>
