import { getBaseUrl } from "$lib/config/directories";
import { settings } from "$lib/settings/index.svelte";
import { get } from "svelte/store";

export const makeRequest = async (directory: string, method: string, data: any = null) => {

    let res;

    console.log(data);

    try {
        res = await fetch(getBaseUrl() + get(settings).OWNER_NAME + '/' + get(settings).REPO_NAME + '/contents/' + directory, {
            method: method,
            headers: {
                'Authorization': `Bearer ` + get(settings).TOKEN,
                'Content-Type': 'application/json',
                'X-GitHub-Api-Version': '2022-11-28',
                'Accept': 'application/vnd.github+json'
            },
            body: data
        });

        try {
            let data = await res.json();
            return data;
        } catch (ex: any) {
            throw new Error("Parse request failed", { cause: ex });
        }

    } catch (ex: any) {
        throw new Error("Request failed", { cause: ex });
    }
}

export const downloadFile = async (path: string) => {
    let res;

    var query = `query {
                    repository(name: "` + get(settings).REPO_NAME + `", owner: "` + get(settings).OWNER_NAME + `" ) {
                        object(expression: "` + get(settings).BRANCH + `:` + path + `") {
                        ... on Blob {
                            text
                        }
                        }
                    }
            }`;

    try {
        res = await fetch(getBaseUrl(true), {
            method: "POST",
            headers: {
                'Authorization': `token ` + get(settings).TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: query
            }),
        });

        try {
            let data = await res.json();
            return data;
        } catch (ex: any) {
            throw new Error("File parse failed", { cause: ex });
        }

    } catch (ex: any) {
        throw new Error("File download failed", { cause: ex });
    }
}

export const putFile = async (directory: string, data: any = null) => {
    
    let res;

    //first we gotta get the previous commit, because nothing can be easy
    try {
        res = await fetch(getBaseUrl(true), {
            method: "POST",
            headers: {
                'Authorization': `token ` + get(settings).TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `{ repository(name: "` + get(settings).REPO_NAME + `", owner: "` + get(settings).OWNER_NAME + `") {
                                ref(qualifiedName: "refs/heads/` + get(settings).BRANCH + `") {
                                    name
                                    target {
                                        ... on Commit {
                                        history(first: 1) {
                                            nodes {
                                            oid
                                            }
                                        }
                                    }
                                    }
                                }
                            }
                }`
            }),
        });

        let response = await res.json();

        //there has GOT to be a better way to do this
        var oid = response['data']['repository']['ref']['target']['history']['nodes'][0]['oid'];

        //now we can post the file
        res = await fetch(getBaseUrl(true), {
            method: "POST",
            headers: {
                'Authorization': `token ` + get(settings).TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `mutation ($input: CreateCommitOnBranchInput!) { createCommitOnBranch(input: $input) { commit { url } } }`,
                variables: {
                    input: {
                        branch: {
                            repositoryNameWithOwner : get(settings).OWNER_NAME + '/' + get(settings).REPO_NAME,
                            branchName: get(settings).BRANCH
                          },
                          message: {
                            headline: "Updated character"
                          },
                          fileChanges: {
                            additions: [
                              {
                                path: directory,
                                contents: data.content
                              }
                            ]
                          },
                          expectedHeadOid: oid
                        }
                    }
                })
        });

        console.log(await res.json());

    } catch (ex: any) {
        throw new Error("Getting latest commit failed", { cause: ex });
    }

}