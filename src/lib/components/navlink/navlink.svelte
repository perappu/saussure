<script>
    import { page } from '$app/state';
    import { onMount } from 'svelte';

    let currentPath;
    export let href;

    onMount(() => {
        currentPath = window.location.pathname;
    });
  
</script>
  
<a {href} class:active={page.url.pathname === href}><slot></slot></a>