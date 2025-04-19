import { fetchCharacters } from '$lib/data/characters.svelte';
import { fetchLiteratures } from '$lib/data/literatures.svelte';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
    await fetchCharacters();
    await fetchLiteratures();
};
