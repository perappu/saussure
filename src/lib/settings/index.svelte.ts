import { persisted } from 'svelte-persisted-store'

export const settings = persisted('SETTINGS', {} as Settings);