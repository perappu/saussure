import { fetchImages } from '$lib/data/images.svelte';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
    if (localStorage.getItem("SETTINGS") && JSON.parse(localStorage.getItem("SETTINGS")!).TOKEN) {
         await fetchImages()
    }
};