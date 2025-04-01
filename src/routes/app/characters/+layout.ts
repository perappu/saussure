import { fetchCharacters } from '$lib/data/characters.svelte';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
    if (localStorage.getItem("SETTINGS") && JSON.parse(localStorage.getItem("SETTINGS")!).TOKEN) {
         await fetchCharacters()
    }
};