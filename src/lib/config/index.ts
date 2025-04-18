import YAML from 'yaml';
import { persisted } from 'svelte-persisted-store';
import type { Settings } from '$lib/types';
import { get } from 'svelte/store';
import { settings } from '$lib/stores';

export var siteConfig = {};

/**
 * Get the user's local YAML config file
 *
 * @returns The parsed config
 */
const fetchSiteConfig = async () => {
    const href =
        window.location.pathname === '/admin'
            ? '/admin/config.yml'
            : './config.yml';

    let response;

    try {
        response = await fetch(href);
    } catch (ex: any) {
        throw new Error('Fetch failed', { cause: ex });
    }

    try {
        return YAML.parse(await response.text());
    } catch (ex: any) {
        throw new Error('Config parse failed', { cause: ex });
    }
};

/**
 * Initialize the site config and load it into the exported variable
 *
 * @returns null
 */
export const initSiteConfig = async () => {
    siteConfig = {};

    try {
        siteConfig = await fetchSiteConfig();
    } catch (ex: any) {
        console.error(ex);
    }
};

/**
 * Set the config to the default 11ty settings
 *
 * @returns void
 */
export const setConfigEleventy = async () => {
    let changes = get(settings);

    changes.LAYOUT_DIRECTORY = '_includes/layouts';
    changes.BASE_LAYOUT = 'base.njk';
    changes.CHARACTER_LAYOUT = 'character.njk';
    changes.IMAGE_LAYOUT = 'image.njk';
    changes.LITERATURE_LAYOUT = 'literature.njk';
    changes.CHARACTER_DIRECTORY = 'content/characters';
    changes.IMAGE_DIRECTORY = 'content/images';
    changes.LITERATURE_DIRECTORY = 'content/literature';

    settings.set(changes);
};
