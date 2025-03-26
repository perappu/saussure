import { settings } from "$lib/config";
import { get } from "svelte/store";
import { fetchCharacterLayout11ty } from "./11ty.svelte";

/**
 * Fetch the character preview based on the user's frontend settings
 * 
 * @returns The rendered HTML
 */
export const fetchCharacterLayout = async () => {
    if(get(settings).FRONTEND === '11ty') {
        return await fetchCharacterLayout11ty();
    } else if(get(settings).FRONTEND === 'custom') {
        //TODO
    } else {
        return null;
    }
}