<script lang="ts">
    import { navigating, page } from "$app/state";
    import { m } from "$lib/paraglide/messages";
    import { Locale, Spinner } from "$lib/components";
    import { SvelteToast } from "@zerodevx/svelte-toast";
    import { onNavigate } from "$app/navigation";
    import { settings } from "$lib/stores";
    import NavLink from "$lib/components/navlink/navlink.svelte";

    let { children, data } = $props();

    onNavigate((navigation) => {
        if (!document.startViewTransition) return;

        return new Promise((resolve) => {
            document.startViewTransition(async () => {
                resolve();
                await navigation.complete;
            });
        });
    });
</script>

<svelte:head>
    {#if $settings.THEME == "light"}
        {document
            .getElementById("watercss")!
            .setAttribute(
                "href",
                "https://cdn.jsdelivr.net/npm/water.css@2/out/light.css",
            )}
        {document
            .getElementById("sharedcss")!
            .setAttribute(
                "href",
                "/shared-light.css",
            )}
    {:else}
        {document
            .getElementById("watercss")!
            .setAttribute(
                "href",
                "https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css",
            )}
        {document
            .getElementById("sharedcss")!
            .setAttribute(
                "href",
                "/shared-dark.css",
            )}
    {/if}
</svelte:head>

<header>
    <nav>
        <NavLink href="/app/">{m.home()}</NavLink>
        <NavLink href="/app/characters">{m.characters()}</NavLink>
        <NavLink href="/app/images">{m.images()}</NavLink>
        <NavLink href="/app/literatures">{m.literatures()}</NavLink>
        <NavLink href="/app/settings">{m.settings()}</NavLink>
    </nav>
</header>

<SvelteToast />

<main class="container">
    {#if navigating.to}
        <div style="text-align:center; margin:auto;">
            <Spinner />
        </div>
    {:else}
        {@render children()}
    {/if}
</main>

<footer style="text-align: center; margin: 10px;">
    <Locale />
</footer>