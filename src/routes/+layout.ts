import { fetchCharacters } from '$lib/data/characters.svelte';
import { getLocale, setLocale } from '$lib/paraglide/runtime';
import { get } from 'svelte/store';
import type { LayoutLoad } from './$types';
import { locale, settings } from '$lib/config';

export const ssr = false;
export const prerender = true;

export const load: LayoutLoad = async () => {

    if(get(settings).LANGUAGE) {

        console.log(getLocale());

        try {
            setLocale(get(locale) as 'en' | 'es' | 'de');
        } catch {
            setLocale('en');
        }
    }

    if (localStorage.getItem("SETTINGS") && JSON.parse(localStorage.getItem("SETTINGS")!).TOKEN) {
        return {
            characters: await fetchCharacters()
        };
    } else {
        return {
            characters: null
        }
    }
};