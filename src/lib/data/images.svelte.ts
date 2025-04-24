import { get } from 'svelte/store';
import matter from 'gray-matter';
import { m } from '$lib/paraglide/messages';
import {
    downloadBinaryFileGithub,
    fetchImagesGithub,
    putFileGithub
} from '$lib/backends/github.svelte';
import { images, settings } from '$lib/stores';
import { fileToBase64 } from '$lib/utils';
import { makeAPIRequest } from '$lib/backends/requests.svelte';
import { PUBLIC_S3_URL } from '$env/static/public';

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
 * Fetch the 'download' link for an image to display it
 * 
 * @params The path of the file (includes media storage path)
 * @returns The url of the image
 */
export const fetchImageDownload = async (path: string) => {

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

    //now to do file nonsense
    if (data.image) {
        //todo: make this better and not just ripped from SO
        let imageBlob = (await fileToBase64(data.image)) as string;

        try {
            if (get(settings).MEDIA_STORAGE === 's3') {
                let imageBody = {
                    size: data.image.size,
                    name: get(settings).MEDIA_PATH + '/' + filename,
                    blob: imageBlob,
                    type: data.image.type
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
                    sha: data.sha,
                    content: imageBlob.split(',').pop(),
                    branch: get(settings).BRANCH
                };

                if (get(settings).BACKEND === 'github') {
                    let result = await putFileGithub(
                        get(settings).MEDIA_PATH + '/' + filename,
                        imageBody
                    );
                    console.log(result);
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
        } catch (ex) {
            throw new Error('Could not put delete file', { cause: ex });
        }
    } else if (get(settings).BACKEND === 'forgejo') {
        //TODO
    } else {
        return null;
    }

    //we also need to delete the associated media
    if (get(settings).MEDIA_STORAGE === 's3') {
        let imageBody = {
            name: get(settings).MEDIA_PATH + '/' + filename
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
        if (get(settings).BACKEND === 'github') {
            try {
                await putFileGithub(
                    get(settings).MEDIA_PATH + '/' + filename,
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
            return null;
        }
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
        if (get(settings).MEDIA_STORAGE === 's3') {
            let imageBody = {
                size: data.image.size,
                name: get(settings).MEDIA_PATH + '/' + filename,
                blob: imageBlob,
                type: data.image.type
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
                sha: data.sha,
                content: imageBlob.split(',').pop(),
                branch: get(settings).BRANCH
            };

            if (get(settings).BACKEND === 'github') {
                let result = await putFileGithub(
                    get(settings).MEDIA_PATH + '/' + filename,
                    imageBody
                );
                console.log(result);
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
