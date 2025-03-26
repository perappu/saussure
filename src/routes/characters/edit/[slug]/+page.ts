import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { fetchCharacterLayout } from '$lib/frontends/layouts.svelte';

export const load: PageLoad = async ({ params, parent }) => {

    const { characters } = await parent();

    //get the character
    let character;
    character = characters!.find((c) => c.filename === params.slug);
    if (!character) error(404, "Character could not be found.");

    //get the HTML layout for rendering live previews
    let layouts = await fetchCharacterLayout();

    return { character: character, layouts: layouts };
};