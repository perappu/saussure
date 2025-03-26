import { settings } from "$lib/config";
import { get } from "svelte/store";

/**
 * Get the base URL for API requests based on the user's backend settings
 * 
 * @param graphQL if the URL should be the graphQL endpoint
 * @returns The endpoint to use
 */
export function getBaseUrl(graphQL: boolean = false) {
    if(get(settings).BACKEND == 'github') {
        if(graphQL == true) {
            return 'https://api.github.com/graphql';
        } else {
           return 'https://api.github.com/repos/';
        }
    } else {
        return '';
    }
}

/**
 * Get the character directory based on the user's frontend settings
 * 
 * @returns The directory to use
 */
export function getCharacterDirectory() {

    if(get(settings).FRONTEND == 'custom') {
        if(get(settings).CHARACTER_DIRECTORY) {
            return get(settings).CHARACTER_DIRECTORY;
        } else {
            return '';
        }
    } else if(get(settings).FRONTEND == '11ty') {
        return 'content/characters';
    }
}