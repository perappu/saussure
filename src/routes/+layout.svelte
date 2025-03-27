<script lang="ts">
    import { settings } from "$lib/config";
    import { navigating, page } from "$app/state";
    import { m } from "$lib/paraglide/messages";
    import { Locale } from "$lib/components";
    import { SvelteToast } from "@zerodevx/svelte-toast";

    let { children } = $props();
</script>

<svelte:head>
    {#if $settings.THEME == "light"}
        {document.getElementById("watercss")!.setAttribute("href", "https://cdn.jsdelivr.net/npm/water.css@2/out/light.css")}
    {:else}
        {document.getElementById("watercss")!.setAttribute("href", "https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css")}
    {/if}
</svelte:head>

<header>
    <nav>
        <a href="/">{m.home()}</a>
        <a href="/characters">{m.characters()}</a>
        <a href="/images">{m.images()}</a>
        <a href="/literatures">{m.literatures()}</a>
        <a href="/settings">{m.settings()}</a>
    </nav>
</header>

<SvelteToast />

<main class="container">
    {#if navigating.to}
        <div aria-busy="true">{m.loading()}...</div>
    {:else}
        {@render children()}
    {/if}
</main>

<footer style="text-align: center; margin: 10px;">
    <Locale />
</footer>