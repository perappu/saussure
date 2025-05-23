import { get } from 'svelte/store';
import { makeAPIRequest, makeGraphQLRequest } from './requests.svelte';
import matter from 'gray-matter';
import type { Character, Image, Literature } from '$lib/types';
import { characters, settings, token } from '$lib/stores';
import { redirect } from '@sveltejs/kit';
import { getBaseUrl } from '$lib/config';

/************ DATA FETCH */

/**
 * Fetch characters using the Github backend
 *
 * @returns JSON of the character files
 */
export const fetchCharactersGithub = async () => {
    try {
        let request = await downloadFilesGithub(
            get(settings).CHARACTER_DIRECTORY
        );

        // todo: simplify this logic
        var files = request['data']['repository']['object']['entries']
            .map((file: any) => {
                return {
                    name: file.name,
                    text: file.object.text
                };
            })
            .filter((file: any) => file !== null);

        var validFiles = files
            .map((file: any) => {
                //todo: support non-md file extensions
                return file.name.endsWith('.md') ? file : null;
            })
            .filter((file: any) => file !== null);

        var chars = <Character[]>[];

        for (const file of validFiles) {
            let parsed = matter(file.text);

            const { name, tags, category, icon, ...fields } = parsed.data;

            chars.push({
                name: name,
                tags: tags,
                category: category,
                icon: icon,
                fields: fields,
                filename: file.name,
                fileslug: file.name.split('.')[0],
                contents: parsed.content,
                sha: file.sha
            });
        }

        return chars;
    } catch (ex: any) {
        //it's really common that the character fetch will fail if we refresh on a weird route like an edit or create
        //in that case, we just log it in the console and redirect to the main page
        //maybe we can handle it better in the future
        console.log("Redirected to /app. Couldn't fetch characters: " + ex);
        redirect(307, '/app');
        //throw new Error("Couldn't fetch characters", { cause: ex });
    }
};

/**
 * Fetch images using the Github backend
 *
 * @returns JSON of the character files
 */
export const fetchImagesGithub = async () => {
    try {
        try {
            let request = await downloadFilesGithub(
                get(settings).IMAGE_DIRECTORY
            );

            // todo: simplify this logic
            var files = request['data']['repository']['object']['entries']
                .map((file: any) => {
                    return {
                        name: file.name,
                        text: file.object.text
                    };
                })
                .filter((file: any) => file !== null);
        } catch (ex: any) {
            console.log(
                'Could not find images in response -- directory either nonexistent or empty'
            );
            return [];
        }

        var validFiles = files
            .map((file: any) => {
                //todo: support non-md file extensions? we may just force everything to markdown
                return file.name.endsWith('.md') ? file : null;
            })
            .filter((file: any) => file !== null);

        var imgs = <Image[]>[];

        for (const imgFile of validFiles) {
            let parsed = matter(imgFile.text);

            const { title, tags, character, file, ...fields } = parsed.data;

            //get the name of the character for UX purposes
            let characterName = get(characters).filter(
                (c) => character.includes(c.fileslug)
            )?.map(item => item['name']).toString();

            imgs.push({
                title: title,
                tags: tags,
                character: character.split(','),
                characterName: characterName,
                fields: fields,
                filename: file,
                contents: parsed.content,
                sha: file.sha
            });
        }

        return imgs;
    } catch (ex: any) {
        throw new Error("Couldn't fetch images", { cause: ex });
    }
};

/**
 * Fetch literatures using the Github backend
 *
 * @returns JSON of the literature files
 */
export const fetchLiteraturesGithub = async () => {
    try {
        try {
            let request = await downloadFilesGithub(
                get(settings).LITERATURE_DIRECTORY
            );

            // todo: simplify this logic
            var files = request['data']['repository']['object']['entries']
                .map((file: any) => {
                    return {
                        name: file.name,
                        text: file.object.text
                    };
                })
                .filter((file: any) => file !== null);
        } catch (ex: any) {
            console.log(
                'Could not find literatures in response -- directory either nonexistent or empty'
            );
            return [];
        }

        var validFiles = files
            .map((file: any) => {
                //todo: support non-md file extensions? we may just force everything to markdown
                return file.name.endsWith('.md') ? file : null;
            })
            .filter((file: any) => file !== null);

        var lits = <Literature[]>[];

        for (const file of validFiles) {
            let parsed = matter(file.text);

            const { title, tags, character, ...fields } = parsed.data;

            //get the name of the character for UX purposes
            let characterName = get(characters).filter(
                (c) => character.includes(c.fileslug)
            )?.map(item => item['name']).toString();

            lits.push({
                title: title,
                tags: tags,
                character: character,
                characterName: characterName,
                fields: fields,
                filename: file.name,
                contents: parsed.content,
                sha: file.sha
            });
        }

        return lits;
    } catch (ex: any) {
        throw new Error("Couldn't fetch literatures", { cause: ex });
    }
};

/************ REQUESTS */

/**
 * Make a request using the Github backend
 *
 * @returns JSON api response
 */
export const makeRequestGithub = async (
    directory: string,
    method: string,
    data: any = null
) => {
    return await makeAPIRequest(
        getBaseUrl() +
            get(settings).OWNER_NAME +
            '/' +
            get(settings).REPO_NAME +
            '/contents/' +
            directory,
        'GET',
        {
            Authorization: `Bearer ` + get(token),
            'Content-Type': 'application/json',
            'X-GitHub-Api-Version': '2022-11-28',
            Accept: 'application/vnd.github+json'
        }
    );
};

/**
 * Download a binary file using the Github backend
 *
 * @returns JSON api response
 */
export const downloadBinaryFileGithub = async (path: string) => {
    let req = await makeAPIRequest(
        getBaseUrl() +
            get(settings).OWNER_NAME +
            '/' +
            get(settings).REPO_NAME +
            '/contents/' +
            path + '?ref=' + get(settings).BRANCH,
        'GET',
        {
            Authorization: `Bearer ` + get(token),
            'Content-Type': 'application/json',
            'X-GitHub-Api-Version': '2022-11-28',
            Accept: 'application/vnd.github+json'
        }
    );

    return req['download_url'];
};

/**
 * Download a file using the Github backend
 *
 * @returns JSON api response
 */
export const downloadFileGithub = async (path: string) => {
    var query =
        `query {
                    repository(name: "` +
        get(settings).REPO_NAME +
        `", owner: "` +
        get(settings).OWNER_NAME +
        `" ) {
                        object(expression: "` +
        get(settings).BRANCH +
        `:` +
        path +
        `") {
                        ... on Blob {
                            text
                }}}}`;

    return await makeGraphQLRequest(
        getBaseUrl(true),
        {
            Authorization: `token ` + get(token),
            'Content-Type': 'application/json'
        },
        query
    );
};

/**
 * Download all files in a directory using the Github backend
 *
 * @returns JSON api response
 */
export const downloadFilesGithub = async (path: string) => {
    var query =
        `query {
                    repository(name: "` +
        get(settings).REPO_NAME +
        `", owner: "` +
        get(settings).OWNER_NAME +
        `" ) {
                        object(expression: "` +
        get(settings).BRANCH +
        `:` +
        path +
        `") {
                        ... on Tree {
                          entries {
                            name
                            object {
                              ... on Blob {
                                text
                              }}}}}}}`;

    return await makeGraphQLRequest(
        getBaseUrl(true),
        {
            Authorization: `token ` + get(token),
            'Content-Type': 'application/json'
        },
        query
    );
};

/**
 * Put a file using the Github backend
 *
 * @param directory The target directory
 * @param data The body of the request
 * @param addition Whether or not this is an addition (true) or a deletion (false)
 * @returns JSON api response
 */
export const putFileGithub = async (
    directory: string,
    data: any = null,
    addition: boolean = true
) => {
    //first we get the oid because nothing can be easy
    var query =
        `{ repository(name: "` +
        get(settings).REPO_NAME +
        `", owner: "` +
        get(settings).OWNER_NAME +
        `") { ref(qualifiedName: "refs/heads/` +
        get(settings).BRANCH +
        `") { name target { ... on Commit { history(first: 1) { nodes { oid }}}}}}}`;

    var headers = {
        Authorization: `token ` + get(token),
        'Content-Type': 'application/json'
    };

    var response = await makeGraphQLRequest(getBaseUrl(true), headers, query);

    //there has GOT to be a better way to do this
    var oid =
        response['data']['repository']['ref']['target']['history']['nodes'][0][
            'oid'
        ];

    var fileChanges;
    if (addition == true) {
        fileChanges = {
            additions: [
                {
                    path: directory,
                    contents: data.content
                }
            ]
        };
    } else {
        fileChanges = {
            deletions: [
                {
                    path: directory,
                    contents: data.content
                }
            ]
        };
    }

    //now we can put the file
    query = `mutation ($input: CreateCommitOnBranchInput!) { createCommitOnBranch(input: $input) { commit { url } } }`;
    let variables = {
        input: {
            branch: {
                repositoryNameWithOwner:
                    get(settings).OWNER_NAME + '/' + get(settings).REPO_NAME,
                branchName: get(settings).BRANCH
            },
            message: {
                headline: data.message
            },
            fileChanges: fileChanges,
            expectedHeadOid: oid
        }
    };

    response = await makeGraphQLRequest(
        getBaseUrl(true),
        headers,
        query,
        variables
    );

    try {
        //this gets the commit hash from the response and logs it
        console.log(response.data.createCommitOnBranch.commit.url.split('/')[6]);

        return response.data.createCommitOnBranch.commit.url.split('/')[6];
    } catch(ex) {
        console.log(response);
        throw new Error('Error putting file to github', { cause: ex });
    }
};
