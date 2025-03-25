import { characters, fetchCharacters } from '$lib/data/characters.svelte';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {

    //because i guess it won't load the characters if we refresh on a specific character's page
    let character;

    if(!characters) {
        let chars = await fetchCharacters();
        console.log(chars);
        character = (chars).find((c) => c.filename === params.slug);
    } else {
        character = (characters).find((c) => c.filename === params.slug);
    }

    if (!character) error(404, "Character could not be found.");

    return character;
};