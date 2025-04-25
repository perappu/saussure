import matter from 'gray-matter';
import { get } from 'svelte/store';
import {
    fetchLiteraturesGithub,
    putFileGithub
} from '$lib/backends/github.svelte';
import { m } from '$lib/paraglide/messages';
import { literatures, settings } from '$lib/stores';
import { Base64 } from 'js-base64';

/**
 * Fetch characters based on the user's backend settings
 *
 * @returns The fetched characters
 */
export const fetchLiteratures = async () => {
    if (get(settings).BACKEND === 'github') {
        literatures.set(
            (await fetchLiteraturesGithub()).sort((a, b) => {
                if (a.character > b.character) {
                    return 1;
                }
                if (a.character < b.character) {
                    return -1;
                }
                return 0;
            })
        );
    } else if (get(settings).BACKEND === 'forgejo') {
        //TODO
    } else {
        return [];
    }
};

/**
 * Writes a literature file via API based on the user's backend settings
 *
 * @param filename The filename to write
 * @param formData The FormData object pulled from the edit/create literature page
 * @returns The API response
 */
export const writeLiterature = async (filename: string, formData: FormData) => {
    var data: any = Object.fromEntries(formData);

    //squish the key/value fields back together
    var keys = Object.keys(data).filter((v) => v.startsWith('key'));

    var fields: any = {};
    for (let i = 0; i < keys.length; i++) {
        fields[data['key' + i]] = data['value' + i];
    }

    //use matter to put the content and front matter into a nice MD file format
    var blob = matter.stringify(data.content, {
        character: data.character,
        title: data.title,
        tags: data.tags,
        ...fields
    });

    //create the body of the request
    var body = {
        message: m.updated_file() + ' ' + filename,
        sha: data.sha,
        content: Base64.encode(blob),
        branch: get(settings).BRANCH
    };

    //call putFile function based on configured backend
    if (get(settings).BACKEND === 'github') {
        return await putFileGithub(
            get(settings).LITERATURE_DIRECTORY + '/' + filename,
            body
        );
    } else if (get(settings).BACKEND === 'forgejo') {
        //TODO
    } else {
        return null;
    }
};

/**
 * Deletes a literature file via API based on the user's backend settings
 *
 * @param filename The filename to delete
 * @param formData The FormData object pulled from the edit/create literature page
 * @returns The API response
 */
export const deleteLiterature = async (
    filename: string,
    formData: FormData
) => {
    var data: any = Object.fromEntries(formData);

    //create the body of the request
    var body = {
        message: m.deleted_file() + ' ' + filename,
        sha: data.sha,
        branch: get(settings).BRANCH
    };

    //call putFile function based on configured backend
    if (get(settings).BACKEND === 'github') {
        return await putFileGithub(
            get(settings).LITERATURE_DIRECTORY + '/' + filename,
            body,
            false
        );
    } else if (get(settings).BACKEND === 'forgejo') {
        //TODO
    } else {
        return null;
    }
};
