import { get } from 'svelte/store';
import { renderLayout } from './layouts.svelte';
import { settings } from '$lib/stores';

/**
 * Render a preview based on the user's frontend settings
 *
 * @returns The rendered HTML
 */
export const renderPreview = (
    layouts: any,
    child: string,
    formData: FormData
) => {
    var data: any = Object.fromEntries(formData);

    //squish the key/value fields back together
    var keys = Object.keys(data).filter((v) => v.startsWith('key'));

    var fields: any = {};
    for (let i = 0; i < keys.length; i++) {
        fields[data['key' + i]] = data['value' + i];
        delete data['key' + i];
    }

    var allData = { ...data, ...fields };

    let rendered;

    try {
        rendered = renderLayout(layouts, child, allData) as string;
    } catch (ex) {
        rendered = `
        <div style='background-color: #ffffff8f; border-radius: 5px; border: 1px #0000006b solid; padding: 10px; font-family: arial, sans-serif; font-size: 1em;'> 
        <p>Could not render live preview due to error:</p> 
        <p style='color:rgb(116, 40, 40)'>${ex}</p> 
        <p>You may have a filter or other syntax specific to your framework that the default render library doesn't recognize.</p>
        </div>`;
    }

    return rendered;
};
