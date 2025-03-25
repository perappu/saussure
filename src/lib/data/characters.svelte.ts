import { downloadFile, makeRequest, putFile } from "./requests.svelte";
import { getCharacterDirectory } from "$lib/config/directories";
import matter from "gray-matter";
import { settings } from "$lib/settings/index.svelte";
import { get } from "svelte/store";

export var characters: any[];

export const fetchCharacters = async () => {
    try {
        let request = await makeRequest(getCharacterDirectory(), 'GET');

        var validFiles = request.map((file: any) => {
            return file.name.endsWith(".md") ? file : null;
        }).filter((file: any) => file !== null);

        var chars = [];

        for (const file of validFiles) {
            let contents = await downloadFile(file.path);

            let raw = contents['data']['repository']['object']['text'];
            let parsed = matter(raw);

            const {name, tags, folder, ...fields} = parsed.data;

            chars.push({
                name: name,
                tags: tags,
                folder: folder,
                fields: fields,
                filename: file.name,
                contents: parsed.content,
                sha: file.sha
            });
        }

        //why is this necessary
        characters = chars;
        return characters;
    } catch (ex: any) {
        throw new Error("Couldn't fetch characters", { cause: ex });
    }
}

export const writeCharacter = async (filename: string, formData: any) => {

    console.log(filename);

    var data = Object.fromEntries(formData);

    //squish the fields back together
    var keys = Object.keys(data).filter(v => v.startsWith('key'));

    var fields: any = {};
    for (let i = 0; i < keys.length; i++) {
        fields[data['key'+i]] = data['value'+i];
    }

    var blob = matter.stringify(data.description, {
        name: data.name,
        tags: data.tags,
        folder: data.folder ?? null,
        ...fields
    });

    var body = {
        message: 'Update character data',
        sha: data.sha,
        content: window.btoa(blob),
        branch: get(settings).BRANCH
    };

    return await putFile(getCharacterDirectory() + filename, body);
}