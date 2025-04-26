import YAML from 'yaml';
import { persisted } from 'svelte-persisted-store';
import type { Settings } from '$lib/types';
import { get } from 'svelte/store';
import { settings } from '$lib/stores';

export var siteConfig = {};

export var toastConfig = {
    success : {
        '--toastColor': 'mintcream',
        '--toastBackground': 'rgba(62, 168, 106,0.9)',
        '--toastBarBackground': '#2F855A'
    },
    fail : {
        '--toastColor': 'mistyrose',
        '--toastBackground': 'rgba(118, 45, 45, 0.9)',
        '--toastBarBackground': 'rgba(58, 16, 16, 0.9)'
    }
};

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

    changes.LAYOUT_DIRECTORY = 'src/_layouts';
    changes.BASE_LAYOUT = 'base.njk';
    changes.CHARACTER_LAYOUT = 'character.njk';
    changes.IMAGE_LAYOUT = 'image.njk';
    changes.LITERATURE_LAYOUT = 'literature.njk';
    changes.CHARACTER_DIRECTORY = 'src/content/characters';
    changes.IMAGE_DIRECTORY = 'src/content/images';
    changes.LITERATURE_DIRECTORY = 'src/content/literatures';

    changes.MEDIA_PATH = 'src/assets/images';

    settings.set(changes);
};

/**
 * Get the base URL for API requests based on the user's backend settings
 *
 * @param graphQL if the URL should be the graphQL endpoint
 * @returns The endpoint to use
 */
export function getBaseUrl(graphQL: boolean = false) {
    if (get(settings).BACKEND == 'github') {
        if (graphQL == true) {
            return 'https://api.github.com/graphql';
        } else {
            return 'https://api.github.com/repos/';
        }
    } else {
        return '';
    }
}
