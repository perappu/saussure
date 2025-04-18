import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { fetchLayout } from '$lib/frontends/layouts.svelte';
import { fetchCharacters } from '$lib/data/characters.svelte';
import { get } from 'svelte/store';
import { characters, images, settings } from '$lib/stores';
import { fetchImages } from '$lib/data/images.svelte';

export const load: PageLoad = async ({ params, parent }) => {
    //if we refresh on the specific edit page, the character store won't have been fetched
    if (get(characters).length === 0) {
        try {
            await fetchCharacters();
            await fetchImages();
        } catch (ex) {
            if (get(characters).length === 0)
                error(404, 'Could not fetch images');
        }
    }

    //get the image
    let image;
    image = get(images).find((c) => c.filename === params.slug);
    if (!image) error(404, 'Image could not be found.');

    //get the HTML layout for rendering live previews
    let layouts = await fetchLayout(get(settings).IMAGE_LAYOUT);

    return { image: image, layouts: layouts };
};
