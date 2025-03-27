<script lang="ts">
    let { html } = $props();
</script>

<style>
iframe {
    width: -moz-available;
    width: -webkit-fill-available;
    width: fill-available;
    height: -moz-available;
    height: -webkit-fill-available;
    height: fill-available;
    border: none;
    border-radius: 10px;
}
</style>

<svelte:boundary>
    <iframe title="preview of the character text" srcdoc="{html}"></iframe>
</svelte:boundary>
