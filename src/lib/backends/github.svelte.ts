import { getBaseUrl, getCharacterDirectory } from "$lib/config/directories";
import { settings } from "$lib/config";
import { get } from "svelte/store";
import { makeAPIRequest, makeGraphQLRequest } from "./requests.svelte";
import matter from "gray-matter";
import type { Character } from "$lib/types";

/**
 * Fetch characters using the Github backend
 * 
 * @returns JSON of the character files
 */
export const fetchCharactersGithub = async () => {
    try {
        let request = await downloadFilesGithub(getCharacterDirectory());

        // todo: simplify this logic
        var files = request['data']['repository']['object']['entries'].map((file: any) => {
            return {
                name : file.name,
                text : file.object.text
            };
        }).filter((file: any) => file !== null);

        var validFiles = files.map((file: any) => {
            //todo: support non-md file extensions
            return file.name.endsWith(".md") ? file : null;
        }).filter((file: any) => file !== null);

        var chars = <Character[]>[];

        for (const file of validFiles) {

            let parsed = matter(file.text);

            const { name, tags, category, ...fields } = parsed.data;

            chars.push({
                name: name,
                tags: tags,
                category: category,
                fields: fields,
                filename: file.name,
                contents: parsed.content,
                sha: file.sha
            });
        }

        return chars;
    } catch (ex: any) {
        throw new Error("Couldn't fetch characters", { cause: ex });
    }
}

/**
 * Make a request using the Github backend
 * 
 * @returns JSON api response
 */
export const makeRequestGithub = async (directory: string, method: string, data: any = null) => {

    return await makeAPIRequest(
        getBaseUrl() + get(settings).OWNER_NAME + '/' + get(settings).REPO_NAME + '/contents/' + directory,
        'GET',
        {
            'Authorization': `Bearer ` + get(settings).TOKEN,
            'Content-Type': 'application/json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Accept': 'application/vnd.github+json'
        }
    );

}

/**
 * Download a file using the Github backend
 * 
 * @returns JSON api response
 */
export const downloadFileGithub = async (path: string) => {

    var query = `query {
                    repository(name: "` + get(settings).REPO_NAME + `", owner: "` + get(settings).OWNER_NAME + `" ) {
                        object(expression: "` + get(settings).BRANCH + `:` + path + `") {
                        ... on Blob {
                            text
                }}}}`;

    return await makeGraphQLRequest(getBaseUrl(true),
        {
            'Authorization': `token ` + get(settings).TOKEN,
            'Content-Type': 'application/json'
        }, query);
}

/**
 * Download all files in a directory using the Github backend
 * 
 * @returns JSON api response
 */
export const downloadFilesGithub = async (path: string) => {

    var query = `query {
                    repository(name: "` + get(settings).REPO_NAME + `", owner: "` + get(settings).OWNER_NAME + `" ) {
                        object(expression: "` + get(settings).BRANCH + `:` + path + `") {
                        ... on Tree {
                          entries {
                            name
                            object {
                              ... on Blob {
                                text
                              }}}}}}}`;

    return await makeGraphQLRequest(getBaseUrl(true),
        {
            'Authorization': `token ` + get(settings).TOKEN,
            'Content-Type': 'application/json'
        }, query);
}

/**
 * Put a file using the Github backend
 * 
 * @param directory The target directory
 * @param data The body of the request
 * @param addition Whether or not this is an addition (true) or a deletion (false)
 * @returns JSON api response
 */
export const putFileGithub = async (directory: string, data: any = null, addition: boolean = true) => {

    //first we get the oid because nothing can be easy
    var query = `{ repository(name: "` + get(settings).REPO_NAME + `", owner: "` + get(settings).OWNER_NAME + `") {
                    ref(qualifiedName: "refs/heads/` + get(settings).BRANCH + `") {
                        name
                        target {
                            ... on Commit {
                            history(first: 1) {
                                nodes {
                                oid
                }}}}}}}`;

    var headers = {
        'Authorization': `token ` + get(settings).TOKEN,
        'Content-Type': 'application/json'
    };

    var response = await makeGraphQLRequest(getBaseUrl(true), headers, query);

    //there has GOT to be a better way to do this
    var oid = response['data']['repository']['ref']['target']['history']['nodes'][0]['oid'];

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
                repositoryNameWithOwner: get(settings).OWNER_NAME + '/' + get(settings).REPO_NAME,
                branchName: get(settings).BRANCH
            },
            message: {
                headline: data.message
            },
            fileChanges: fileChanges,
            expectedHeadOid: oid
        }
    };

    response = await makeGraphQLRequest(getBaseUrl(true), headers, query, variables);

    //log the fact we sent the file in the console
    console.log(response);

    return response;

}