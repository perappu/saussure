import { deLocalizeUrl } from '$lib/paraglide/runtime';
import type { ServerInit } from '@sveltejs/kit';

export const init: ServerInit = async () => {};

export const reroute = (request) => deLocalizeUrl(request.url).pathname;
