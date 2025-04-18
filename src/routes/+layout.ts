import { setLocale } from '$lib/paraglide/runtime';
import { get } from 'svelte/store';
import type { LayoutLoad } from './app/$types';
import { locale, settings } from '$lib/stores';

export const ssr = false;

export const load: LayoutLoad = async () => {
    if (get(settings).LANGUAGE) {
        try {
            setLocale(get(locale) as 'en' | 'es' | 'de');
        } catch {
            setLocale('en');
        }
    }
};
