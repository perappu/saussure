import { settings } from "$lib/settings/index.svelte";
import { get } from "svelte/store";

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

export function getCharacterDirectory() {

    if(get(settings).FRONTEND == 'custom') {
        return get(settings).CHARACTER_DIRECTORY;
    } else if(get(settings).FRONTEND == '11ty') {
        return 'content/characters/';
    }
}