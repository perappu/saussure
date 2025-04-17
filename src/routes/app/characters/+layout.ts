import { fetchCharacters } from '$lib/data/characters.svelte';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
    await fetchCharacters();
};