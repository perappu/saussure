import type { Character, Settings } from "$lib/types";
import { writable } from "svelte/store";
import type { Image } from "$lib/types";
import { persisted } from "svelte-persisted-store";

export const settings = persisted('SETTINGS', {} as Settings);
export const locale = persisted('LOCALE', 'en');

//the token is pulled from the cookie storage and saved in memory, since we're sorta kinda a SPA it's accessible everywhere
export const token = writable('');

export const characters = writable([] as Character[]);
export const images = writable([] as Image[]);