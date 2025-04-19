import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { fetchLayout } from '$lib/frontends/layouts.svelte';
import { fetchCharacters } from '$lib/data/characters.svelte';
import { get } from 'svelte/store';
import { characters, literatures, settings } from '$lib/stores';
import { fetchLiteratures } from '$lib/data/literatures.svelte';

export const load: PageLoad = async ({ params, parent }) => {
    //if we refresh on the specific edit page, the character store won't have been fetched
    if (get(literatures).length === 0) {
        try {
            await fetchLiteratures();
        } catch (ex) {
            if (get(characters).length === 0)
                error(404, 'Could not fetch literatures');
        }
    }

    //get the character
    var literature = get(literatures).find((c) => c.filename === params.slug);
    if (!literature) error(404, 'Literature could not be found.');

    //get the HTML layout for rendering live previews
    var layouts = await fetchLayout(get(settings).LITERATURE_LAYOUT);

    return { literature: literature, layouts: layouts };
};
