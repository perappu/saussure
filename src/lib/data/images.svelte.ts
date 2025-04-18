import { get } from 'svelte/store';
import matter from 'gray-matter';
import { m } from '$lib/paraglide/messages';
import { downloadBinaryFileGithub, downloadFileGithub, fetchImagesGithub, putFileGithub } from '$lib/backends/github.svelte';
import { images, settings } from '$lib/stores';

/**
 * Fetch characters based on the user's backend settings
 *
 * @returns The fetched characters
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
    } else if (get(settings).BACKEND === 'forgejo') {
        //TODO
    } else {
        return [];
    }
};

/**
 * Fetch the base 64 representation of a specific image for displaying
 *
 * @returns The fetched characters
 */
export const fetchBase64 = async (path: string) => {
    if (get(settings).BACKEND === 'github') {
        let file = fileToBase64(await downloadBinaryFileGithub(path));
        return file;
    } else if (get(settings).BACKEND === 'forgejo') {
        //TODO
    } else {
        return [];
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
        character: data.character,
        file: filename,
        title: data.title,
        tags: data.tags,
        ...fields
    });

    //create the body of the request
    var body = {
        message: m.updated_file() + ' ' + filename + '.md',
        sha: data.sha,
        content: window.btoa(blob),
        branch: get(settings).BRANCH
    };

    //call putFile function based on configured backend
    if (get(settings).BACKEND === 'github') {
        let result = await putFileGithub(
            get(settings).IMAGE_DIRECTORY + '/' + filename + '.md',
            body
        );
        console.log(result);
    } else if (get(settings).BACKEND === 'forgejo') {
        //TODO
    } else {
        throw new Error(
            'Could not put image markdown file, backend not defined'
        );
    }

    //todo: make this better and not just ripped from SO
    let imageBlob = (await fileToBase64(data.image)) as string;

    //now to do file nonsense
    try {
        //create the body of the request
        var imageBody = {
            message: m.updated_file() + ' ' + filename,
            sha: data.sha,
            content: imageBlob.split(',').pop(),
            branch: get(settings).BRANCH
        };

        let result = await putFileGithub(
            get(settings).MEDIA_PATH + '/' + filename,
            imageBody
        );
        console.log(result);
    } catch (ex) {
        throw new Error('Could not put image file', { cause: ex });
    }
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
            //we also need to delete the associated media
            await putFileGithub(
                get(settings).MEDIA_PATH + '/' + filename,
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
};

/**
 * Writes an image file via API based on the user's backend settings
 *
 * @param filename The filename to write
 * @param formData The FormData object pulled from the edit/create image page
 * @returns The API response
 */
export const reuploadImage = async (filename: string, formData: FormData) => {
    var data: any = Object.fromEntries(formData);

    let imageBlob = (await fileToBase64(data.image)) as string;

    //now to do file nonsense
    try {
        //create the body of the request
        var imageBody = {
            message: m.updated_file() + ' ' + filename,
            sha: data.sha,
            content: imageBlob.split(',').pop(),
            branch: get(settings).BRANCH
        };

        let result = await putFileGithub(
            get(settings).MEDIA_PATH + '/' + filename,
            imageBody
        );
        console.log(result);
    } catch (ex) {
        throw new Error('Could not put image file', { cause: ex });
    }
}

/**
 * Convert a File object to its base64 representation
 *
 * @param blob File or Blob object
 * @returns promised base64 blob or file
 */
const fileToBase64 = (blob: Blob | File) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
});