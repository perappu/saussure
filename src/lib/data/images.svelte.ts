import { get } from 'svelte/store';
import matter from 'gray-matter';
import { characters, m } from '$lib/paraglide/messages';
import {
    fetchImagesGithub,
    putFileGithub
} from '$lib/backends/github.svelte';
import { images, settings } from '$lib/stores';
import { deleteMedia, uploadMedia } from './media.svelte';
import { Base64 } from 'js-base64';

/**
 * Fetch images based on the user's backend settings
 *
 * @returns A bool indicating success
 */
export const fetchImages = async () => {
    if (get(settings).BACKEND === 'github') {
        images.set(
            (await fetchImagesGithub()).sort((a, b) => {
                if (a.character > b.character) {
                    return 1;
                }
                if (a.character < b.character) {
                    return -1;
                }
                return 0;
            })
        );
        return true;
    } else if (get(settings).BACKEND === 'forgejo') {
        //TODO
    } else {
        return false;
    }
};

/**
 * Writes an image file via API based on the user's backend settings
 *
 * @param filename The filename to write
 * @param formData The FormData object pulled from the edit/create image page
 * @returns The API response
 */
export const writeImage = async (filename: string, formData: FormData) => {
    var data: any = Object.fromEntries(formData);

    //squish the key/value fields back together
    var keys = Object.keys(data).filter((v) => v.startsWith('key'));

    var fields: any = {};
    for (let i = 0; i < keys.length; i++) {
        fields[data['key' + i]] = data['value' + i];
    }

    //use matter to put the description and front matter into a nice MD file format
    var blob = matter.stringify(data.content, {
        character: data.characters,
        file: filename,
        title: data.title,
        tags: data.tags,
        ...fields
    });

    //create the body of the request
    var body = {
        message: m.updated_file() + ' ' + filename + '.md',
        sha: data.sha,
        content: Base64.encode(blob),
        branch: get(settings).BRANCH
    };

    let res;

    //call putFile function based on configured backend
    if (get(settings).BACKEND === 'github') {
        let res = await putFileGithub(
            get(settings).IMAGE_DIRECTORY + '/' + filename + '.md',
            body
        );
    } else if (get(settings).BACKEND === 'forgejo') {
        //TODO
        return true;
    } else {
        throw new Error(
            'Could not put image markdown file, backend not defined'
        );
    }

    //do media nonsense
    if (data.image.name) {
        uploadMedia(filename, data.image, res);
    }

    return true;
};

/**
 * Deletes an image file via API based on the user's backend settings
 *
 * @param filename The filename to delete
 * @param formData The FormData object pulled from the edit/create character page
 * @returns The API response
 */
export const deleteImage = async (filename: string, formData: FormData) => {
    var data: any = Object.fromEntries(formData);

    //create the body of the request
    var body = {
        message: m.deleted_file() + ' ' + filename,
        sha: data.sha,
        branch: get(settings).BRANCH
    };

    //call putFile function based on configured backend
    if (get(settings).BACKEND === 'github') {
        try {
            await putFileGithub(
                get(settings).IMAGE_DIRECTORY + '/' + filename + '.md',
                body,
                false
            );
        } catch (ex) {
            throw new Error('Could not put delete file', { cause: ex });
        }
    } else if (get(settings).BACKEND === 'forgejo') {
        //TODO
    } else {
        return null;
    }

    //we also need to delete the associated media
    deleteMedia(filename, data.sha);

};
