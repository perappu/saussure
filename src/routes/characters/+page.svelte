<script lang="ts">
    import { m } from '$lib/paraglide/messages';
    import type { LayoutProps } from '../$types';
    import Character from './character.svelte';

	let { data }: LayoutProps = $props();

</script>

<h1>Characters</h1>

{#await data.characters}
<div aria-busy="true">{m.loading()} {m.characters()}...</div>
{:then characters}
	{#each characters as character}
		<Character {character}/>
	{/each}
{:catch error}
	<p>error loading characters: {error.message}</p>
{/await}