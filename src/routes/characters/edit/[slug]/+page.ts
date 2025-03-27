import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { fetchLayout } from '$lib/frontends/layouts.svelte';
import { characters, fetchCharacters } from "$lib/data/characters.svelte";
import { get } from 'svelte/store';
import { settings } from '$lib/config';

export const load: PageLoad = async ({ params, parent }) => {

    //if we refresh on the specific edit page, the character store won't have been fetched
    if(get(characters).length === 0) {
        try {
            await fetchCharacters();
        } catch(ex) {
            if (get(characters).length === 0) error(404, "Could not fetch characters");
        }
    }

    //get the character
    let character;
    character = get(characters).find((c) => c.filename === params.slug);
    if (!character) error(404, "Character could not be found.");

    //get the HTML layout for rendering live previews
    let layouts = await fetchLayout(get(settings).CHARACTER_LAYOUT);

    return { character: character, layouts: layouts };
};