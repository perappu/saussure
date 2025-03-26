import YAML from 'yaml';
import { persisted } from 'svelte-persisted-store';

export var siteConfig = {};
export const settings = persisted('SETTINGS', {} as App.Settings);
export const locale = persisted('LOCALE', 'en');

/**
 * Get the user's local YAML config file
 * 
 * @returns The parsed config
 */
const fetchSiteConfig = async () => {
  const href = window.location.pathname === '/admin' ? '/admin/config.yml' : './config.yml';

  let response;

  try {
    response = await fetch(href);
  } catch (ex: any) {
    throw new Error("Fetch failed", { cause: ex });
  }

  try {
    return YAML.parse(await response.text());
  } catch (ex: any) {
    throw new Error("Config parse failed", { cause: ex });
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

}