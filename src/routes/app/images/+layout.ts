import { fetchImages } from '$lib/data/images.svelte';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
    await fetchImages();
};
