<script lang="ts">
    import { setLocale } from "$lib/paraglide/runtime";
    import { page } from '$app/state';
    import { locale } from "$lib/stores";

    function onclick(lang: string) {
        locale.set(lang);
        return setLocale(lang as 'en' | 'es' | 'de');
    }
</script>

<a href="{page.url.pathname}" onclick={() => onclick("en")}>🇺🇸</a>
<a href="{page.url.pathname}" onclick={() => onclick("de")}>🇩🇪</a>