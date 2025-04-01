import type { Character } from "$lib/types";
import { writable } from "svelte/store";
import type { Image } from "$lib/types";

export const characters = writable([] as Character[]);

export const images = writable([] as Image[]);

export const loggedIn = writable(true);