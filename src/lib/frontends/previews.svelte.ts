import { settings } from "$lib/config";
import { get } from "svelte/store";
import { renderCharacterLayout11ty } from "./11ty.svelte";

/**
 * Render the character preview based on the user's frontend settings
 * 
 * @returns The rendered HTML
 */
export const renderCharacterPreview = async (layouts: any, formData: FormData) => {

    var data: any = Object.fromEntries(formData);

    //squish the key/value fields back together
    var keys = Object.keys(data).filter(v => v.startsWith('key'));

    var fields: any = {};
    for (let i = 0; i < keys.length; i++) {
        fields[data['key'+i]] = data['value'+i];
        delete data['key'+i];
    }

    var allData = {...data, ...fields};

    if(get(settings).FRONTEND === '11ty') {
        return await renderCharacterLayout11ty(layouts, allData) as string;
    } else if(get(settings).FRONTEND === 'custom') {
        //TODO
    } else {
        return null;
    }
}