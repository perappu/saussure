<script lang="ts">
    import { goto } from "$app/navigation";
    import { loggedIn } from "$lib/stores";
    import { onMount } from "svelte";

    onMount(async () => {
        if ($loggedIn) {
            goto('/app');
        } else {
            goto('/login');
        }
    });
</script>
