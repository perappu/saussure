<script lang="ts">
    import { settings } from "$lib/config";
    import { navigating, page } from "$app/state";
    import { get } from "svelte/store";
    import { m } from "$lib/paraglide/messages";
    import { locales, localizeHref } from '$lib/paraglide/runtime';
    import { Locale } from "$lib/components";

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
        <a href="/">{m.home()}</a>
        <a href="/characters">{m.characters()}</a>
        <a href="/galleries">{m.galleries()}</a>
        <a href="/images">{m.images()}</a>
        <a href="/literatures">{m.literatures()}</a>
        <a href="/settings">{m.settings()}</a>
    </nav>
</header>

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