import { PUBLIC_S3_URL } from "$env/static/public";
import { downloadBinaryFileGithub, putFileGithub } from "$lib/backends/github.svelte";
import { makeAPIRequest } from "$lib/backends/requests.svelte";
import { m } from "$lib/paraglide/messages";
import { settings } from "$lib/stores";
import { fileToBase64 } from "$lib/utils";
import { get } from "svelte/store";

/**
 * Fetch the 'download' link for a piece of media to display it
 * 
 * @params The path of the file (includes media storage path)
 * @returns The url of the image
 */
export const fetchMedia = async (path: string) => {

    if (get(settings).MEDIA_STORAGE === 's3') {

        return PUBLIC_S3_URL + '/' + path;

    } else if (get(settings).MEDIA_STORAGE === 'git') {
        if (get(settings).BACKEND === 'github') {
            let file = await downloadBinaryFileGithub(path);
            return file;
        } else if (get(settings).BACKEND === 'forgejo') {
            //TODO
        } else {
            return [];
        }
    }
};


/**
 * Writes a media file via API based on the user's backend settings
 *
 * @param filename The filename to write
 * @param data The data for the file containing size, type, name
 * @param sha The sha of the previous commit, needed for Git uploads
 * @param path The path within the media path to write to
 * @returns The API response
 */
export const uploadMedia = async (filename: string, data: any, sha?: string, path?: string) => {
    let imageBlob = (await fileToBase64(data)) as string;

    //now to do file nonsense
    try {
        if (get(settings).MEDIA_STORAGE === 's3') {
            let imageBody = {
                size: data.size,
                name: get(settings).MEDIA_PATH + '/' + (path ? path + '/' : '') + filename,
                blob: imageBlob,
                type: data.type
            };

            let req = await makeAPIRequest(
                '/app/s3/upload',
                'POST',
                { 'content-type': 'application/json' },
                JSON.stringify(imageBody)
            );

            console.log(req);
            return true;
        } else if (get(settings).MEDIA_STORAGE === 'git') {
            //create the body of the request
            let imageBody = {
                message: m.updated_file() + ' ' + filename,
                sha: sha,
                content: imageBlob.split(',').pop(),
                branch: get(settings).BRANCH
            };

            if (get(settings).BACKEND === 'github') {
                let result = await putFileGithub(
                    get(settings).MEDIA_PATH + '/' + (path ? path + '/' : '') + filename,
                    imageBody
                );
                return true;
            } else if (get(settings).BACKEND === 'forgejo') {
                //TODO
                return true;
            } else {
                throw new Error(
                    'Could not put image file, backend not defined'
                );
            }
        }
    } catch (ex) {
        throw new Error('Could not put image file', { cause: ex });
    }
};

/**
 * Deletes a media file via API based on the user's backend settings
 *
 * @param filename The filename to write
 * @param sha The previous commit for writing to git
 * @param path The path within the media path to write to
 * @returns The API response
 */
export const deleteMedia = async (filename: string, sha?: string, path?: string) => {

    if (get(settings).MEDIA_STORAGE === 's3') {
        let imageBody = {
            name: get(settings).MEDIA_PATH + '/' + (path ? path + '/' : '') + filename
        };

        let req = await makeAPIRequest(
            '/app/s3/delete',
            'POST',
            { 'content-type': 'application/json' },
            JSON.stringify(imageBody)
        );

        console.log(await req);
        return true;
    } else if (get(settings).MEDIA_STORAGE === 'git') {

        let body = {
            message: m.updated_file() + ' ' + filename,
            sha: sha,
            branch: get(settings).BRANCH
        };

        if (get(settings).BACKEND === 'github') {
            try {
                await putFileGithub(
                    get(settings).MEDIA_PATH + '/' + (path ? path + '/' : '') + filename,
                    body,
                    false
                );
            } catch (ex) {
                throw new Error('Could not put delete file', { cause: ex });
            }
            return true;
        } else if (get(settings).BACKEND === 'forgejo') {
            //TODO
            return true;
        } else {
            return false;
        }
    }

}