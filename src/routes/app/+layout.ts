import { setLocale } from '$lib/paraglide/runtime';
import { locale, settings, token } from '$lib/stores';
import { get } from 'svelte/store';
import type { LayoutLoad } from './$types';

// put the token in a store
export const load: LayoutLoad = async ({ data }) => {
    token.set(data.token);
    if (get(settings).LANGUAGE) {
        try {
            setLocale(get(locale) as 'en' | 'es' | 'de');
        } catch {
            setLocale('en');
        }
    }
};
