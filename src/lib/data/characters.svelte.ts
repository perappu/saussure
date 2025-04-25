import matter from 'gray-matter';
import { get } from 'svelte/store';
import {
    fetchCharactersGithub,
    putFileGithub
} from '$lib/backends/github.svelte';
import { m } from '$lib/paraglide/messages';
import { characters, settings } from '$lib/stores';
import { deleteMedia, uploadMedia } from './media.svelte';
import { Base64 } from 'js-base64';

/**
 * Fetch characters based on the user's backend settings
 *
 * @returns The fetched characters
 */
export const fetchCharacters = async () => {
    if (get(settings).BACKEND === 'github') {
        characters.set(
            (await fetchCharactersGithub()).sort((a, b) => {
                if (a.name > b.name) {
                    return 1;
                }
                if (a.name < b.name) {
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
 * Writes a character file via API based on the user's backend settings
 *
 * @param filename The filename to write
 * @param formData The FormData object pulled from the edit/create character page
 * @returns The API response
 */
export const writeCharacter = async (filename: string, formData: FormData) => {
    var data: any = Object.fromEntries(formData);

    //squish the key/value fields back together
    var keys = Object.keys(data).filter((v) => v.startsWith('key'));

    var fields: any = {};
    for (let i = 0; i < keys.length; i++) {
        fields[data['key' + i]] = data['value' + i];
    }

    //extension of icon, so people can use gifs or whatever
    var extension = data.image.size ? data.image.name.split('.').pop() : data.icon.split('.').pop();

    //use matter to put the description and front matter into a nice MD file format
    var blob = matter.stringify(data.content, {
        name: data.name,
        tags: data.tags,
        icon: filename + '.' + extension,
        category: data.category ?? null,
        ...fields
    });

    //create the body of the request
    var body = {
        message: m.updated_file() + ' ' + filename,
        sha: data.sha,
        content: Base64.encode(blob),
        branch: get(settings).BRANCH
    };

    //capture the commit sha of the putFile so we can use it when uploading the media if needed
    let res;

    //call putFile function based on configured backend
    if (get(settings).BACKEND === 'github') {
        let res = await putFileGithub(
            get(settings).CHARACTER_DIRECTORY + '/' + filename,
            body
        );
    } else if (get(settings).BACKEND === 'forgejo') {
        //TODO
    } else {
        return null;
    }

    //upload icon if present
    if (data.image.name) {
        uploadMedia(filename + '.' + extension, data.image, res, 'icons');
    }
};

/**
 * Deletes a character file via API based on the user's backend settings
 *
 * @param filename The filename to delete
 * @param formData The FormData object pulled from the edit/create character page
 * @returns The API response
 */
export const deleteCharacter = async (filename: string, formData: FormData) => {
    var data: any = Object.fromEntries(formData);

    //create the body of the request
    var body = {
        message: m.deleted_file() + ' ' + filename,
        sha: data.sha,
        branch: get(settings).BRANCH
    };

    let res;

    //call putFile function based on configured backend
    if (get(settings).BACKEND === 'github') {
        let res = await putFileGithub(
            get(settings).CHARACTER_DIRECTORY + '/' + filename,
            body,
            false
        );
    } else if (get(settings).BACKEND === 'forgejo') {
        //TODO
    } else {
        return null;
    }

    //delete icon if present
    deleteMedia(data.icon, res, 'icons');
};
