<script lang="ts">
    import { settings } from "$lib/config";
    import { navigating, page } from "$app/state";
    import { m } from "$lib/paraglide/messages";
    import { Locale, RedirectGate, Spinner } from "$lib/components";
    import { SvelteToast } from "@zerodevx/svelte-toast";
    import { onNavigate } from "$app/navigation";
    import { fade } from "svelte/transition";
    import { loggedIn } from "$lib/stores";

    let { children } = $props();

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
    {:else}
        {document
            .getElementById("watercss")!
            .setAttribute(
                "href",
                "https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css",
            )}
    {/if}
</svelte:head>

<RedirectGate passcondition={$loggedIn} logout={true}>
<header>
    <nav>
        <a href="{process.env.BASE_PATH}/app/">{m.home()}</a>
        <a href="{process.env.BASE_PATH}/app/characters">{m.characters()}</a>
        <a href="{process.env.BASE_PATH}/app/images">{m.images()}</a>
        <a href="{process.env.BASE_PATH}/app/literatures">{m.literatures()}</a>
        <a href="{process.env.BASE_PATH}/app/settings">{m.settings()}</a>
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
</RedirectGate>