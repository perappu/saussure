import { characters, fetchCharacters } from '$lib/data/characters.svelte';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {

    // because this is a .ts and not a .svelte file, we have to get the settings from localstorage this way
    if (localStorage.getItem("SETTINGS") && JSON.parse(localStorage.getItem("SETTINGS")!).TOKEN) {
        return {
            characters: await fetchCharacters()
        };
    } else {
        return {
            characters: null
        }
    }
};