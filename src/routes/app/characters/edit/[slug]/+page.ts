import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { fetchLayout } from '$lib/frontends/layouts.svelte';
import { fetchCharacters } from '$lib/data/characters.svelte';
import { get } from 'svelte/store';
import { characters, settings } from '$lib/stores';

export const load: PageLoad = async ({ params, parent }) => {
    //if we refresh on the specific edit page, the character store won't have been fetched
    if (get(characters).length === 0) {
        try {
            await fetchCharacters();
        } catch (ex) {
            if (get(characters).length === 0)
                error(404, 'Could not fetch characters');
        }
    }

    //get the character
    var character = get(characters).find((c) => c.filename === params.slug);
    if (!character) error(404, 'Character could not be found.');

    //get the HTML layout for rendering live previews
    var layouts = await fetchLayout(get(settings).CHARACTER_LAYOUT);

    return { character: character, layouts: layouts };
};
