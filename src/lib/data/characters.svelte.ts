import { getCharacterDirectory } from "$lib/config/directories";
import matter from "gray-matter";
import { get } from "svelte/store";
import { fetchCharactersGithub, putFileGithub } from "$lib/backends/github.svelte";
import { settings } from "$lib/config";
import { m } from "$lib/paraglide/messages";

export var characters: any[];

/**
 * Fetch characters based on the user's backend settings
 * 
 * @returns The fetched characters
 */
export const fetchCharacters = async () => {
    if(get(settings).BACKEND === 'github') {
        return await fetchCharactersGithub();
    } else if(get(settings).BACKEND === 'forgejo') {
        //TODO
    } else {
        return null;
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
        fields[data['key'+i]] = data['value'+i];
    }

    //use matter to put the description and front matter into a nice MD file format
    var blob = matter.stringify(data.description, {
        name: data.name,
        tags: data.tags,
        folder: data.folder ?? null,
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
    if(get(settings).BACKEND === 'github') {
        return await putFileGithub(getCharacterDirectory() + filename, body);
    } else if(get(settings).BACKEND === 'forgejo') {
        //TODO
    } else {
        return null;
    }
}