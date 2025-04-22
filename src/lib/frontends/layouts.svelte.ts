import { downloadFilesGithub } from '$lib/backends/github.svelte';
import { get } from 'svelte/store';
import {
    renderHandlebars,
    renderLiquid,
    renderMarkdown,
    renderNunjucks
} from './renderers.svelte';
import { settings } from '$lib/stores';
import { error } from '@sveltejs/kit';

/**
 * Fetch the character layouts from the API
 * @param childLayout The child layout that will be rendered by the base, can be null
 * @returns The API response
 */
export const fetchLayout = async (childLayout: string | null = null) => {
    let res;

    //retrieve layouts from backend
    if (get(settings).BACKEND === 'github') {
        res = await downloadFilesGithub(get(settings).LAYOUT_DIRECTORY);

        let layouts = res['data']['repository']['object']['entries'];

        try {
            return {
                baseLayout: layouts.find(
                    (obj: any) => obj['name'] === get(settings).BASE_LAYOUT
                ).object.text,
                childLayout: childLayout
                    ? layouts.find((obj: any) => obj['name'] === childLayout)
                          .object.text
                    : null
            };
        } catch (ex) {
            error(
                404,
                'Layout could not be loaded. Check if the path is valid in your settings.'
            );
        }
    } else if (get(settings).BACKEND === 'forgejo') {
        //TODO
    }

    return null;
};

/**
 * Render a layout with a child
 * Detects which rendering engine to use based on file extensions
 *
 * @param layouts The layouts to render
 * @param child The file name of the child layout
 * @param allData The object data to render into the template
 * @returns The API response
 */
export const renderLayout = (layouts: any, child: string, allData: any) => {
    let html;

    let extension = get(settings).BASE_LAYOUT.split('.');

    switch (extension[extension.length - 1]) {
        case 'md':
            //markdown doesnt have kids lol
            html = renderMarkdown(layouts.baseLayout);
            break;
        case 'njk':
            html = renderNunjucks(layouts.baseLayout, {
                content: renderChildLayout(child, layouts.childLayout, allData)
            });
            break;
        case 'liquid':
            html = renderLiquid(layouts.characterLayout, {
                content: renderChildLayout(child, layouts.childLayout, allData)
            });
            break;
        case 'hbs':
            html = renderHandlebars(layouts.characterLayout, {
                content: renderChildLayout(child, layouts.childLayout, allData)
            });
            break;
        default:
            throw new Error(
                'Could not render, did not find matching extension'
            );
    }

    return html;
};

/**
 * Render a layout with no child
 * Detects which rendering engine to use based on file extension
 *
 * @param layouts The layouts to render
 * @param allData The object data to render into the template
 * @returns The API response
 */
export const renderChildLayout = (child: string, layout: any, allData: any) => {
    let html;

    let extension = child.split('.');

    switch (extension[extension.length - 1]) {
        case 'md':
            //markdown doesnt have kids lol
            html = renderMarkdown(layout);
            break;
        case 'njk':
            html = renderNunjucks(layout, allData);
            break;
        case 'liquid':
            html = renderLiquid(layout, allData);
            break;
        case 'hbs':
            html = renderHandlebars(layout, allData);
            break;
        default:
            throw new Error(
                'Could not render preview, did not find matching extension'
            );
    }

    return html;
};
