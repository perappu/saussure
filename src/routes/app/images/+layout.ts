import { fetchCharacters } from '$lib/data/characters.svelte';
import { fetchImages } from '$lib/data/images.svelte';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
    await fetchCharacters();
    await fetchImages();
};
