
import { get } from "svelte/store";
import { renderLayout } from "./layouts.svelte";
import { settings } from "$lib/stores";

/**
 * Render the character preview based on the user's frontend settings
 * 
 * @returns The rendered HTML
 */
export const renderCharacterPreview = (layouts: any, formData: FormData) => {

    var data: any = Object.fromEntries(formData);

    //squish the key/value fields back together
    var keys = Object.keys(data).filter(v => v.startsWith('key'));

    var fields: any = {};
    for (let i = 0; i < keys.length; i++) {
        fields[data['key'+i]] = data['value'+i];
        delete data['key'+i];
    }

    var allData = {...data, ...fields};

    var rendered = renderLayout(layouts, get(settings).CHARACTER_LAYOUT, allData) as string;

    return rendered;
}