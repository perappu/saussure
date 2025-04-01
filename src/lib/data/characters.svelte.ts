import matter from "gray-matter";
import { get, writable } from "svelte/store";
import { fetchCharactersGithub, putFileGithub } from "$lib/backends/github.svelte";
import { settings } from "$lib/config";
import { m } from "$lib/paraglide/messages";
import { characters } from "$lib/stores";

/**
 * Fetch characters based on the user's backend settings
 * 
 * @returns The fetched characters
 */
export const fetchCharacters = async () => {
    if (get(settings).BACKEND === 'github') {
        characters.set((await fetchCharactersGithub()).sort((a, b) => { 
            if (a.name > b.name) {
                return 1;
            }
            if (a.name < b.name) {
                return -1;
            } 
            return 0;
        }));
    } else if (get(settings).BACKEND === 'forgejo') {
        //TODO
    } else {
        return [];
    }
}

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
    var keys = Object.keys(data).filter(v => v.startsWith('key'));

    var fields: any = {};
    for (let i = 0; i < keys.length; i++) {
        fields[data['key' + i]] = data['value' + i];
    }

    //use matter to put the description and front matter into a nice MD file format
    var blob = matter.stringify(data.content, {
        name: data.name,
        tags: data.tags,
        category: data.category ?? null,
        ...fields
    });

    //create the body of the request
    var body = {
        message: m.updated_file() + ' ' + filename,
        sha: data.sha,
        content: window.btoa(blob),
        branch: get(settings).BRANCH
    };

    //call putFile function based on configured backend
    if (get(settings).BACKEND === 'github') {
        return await putFileGithub(get(settings).CHARACTER_DIRECTORY + "/" + filename, body);
    } else if (get(settings).BACKEND === 'forgejo') {
        //TODO
    } else {
        return null;
    }
}

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

    //call putFile function based on configured backend
    if (get(settings).BACKEND === 'github') {
        return await putFileGithub(get(settings).CHARACTER_DIRECTORY + "/" + filename, body, false);
    } else if (get(settings).BACKEND === 'forgejo') {
        //TODO
    } else {
        return null;
    }

}