import { m } from '$lib/paraglide/messages';
import YAML from 'yaml';

export var siteConfig = {};

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

  export const initSiteConfig  = async () => {
    siteConfig = {};

    try {
        siteConfig = await fetchSiteConfig();

    } catch (ex: any) {
        console.error(ex);
    }

  }