import { characters, fetchCharacters } from '$lib/data/characters.svelte';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    let character;

    //because i guess it won't load the characters if we refresh on a specific character's page
    if(!characters) {
        let chars = await fetchCharacters();
        if(chars) {
            character = (chars).find((c) => c.filename === params.slug);
        } else {
            throw new Error("Could not fetch characters from edit page", { cause: ex });
        }
    } else {
        character = (characters).find((c) => c.filename === params.slug);
    }

    if (!character) error(404, "Character could not be found.");

    return character;
};