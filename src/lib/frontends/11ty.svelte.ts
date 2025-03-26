import { downloadFilesGithub } from "$lib/backends/github.svelte";
import { settings } from "$lib/config";
import { get } from "svelte/store";
import * as nunjucks from "nunjucks";
import matter from "gray-matter";

export const fetchCharacterLayout11ty = async () => {

    let res;

    //retrieve layouts from backend
    if(get(settings).BACKEND === 'github') {
        res = await downloadFilesGithub('_includes/layouts');

        let layouts = res['data']['repository']['object']['entries'];

        return {
            baseLayout : layouts.find((obj: any) => obj['name'] === 'base.njk').object.text,
            characterLayout : layouts.find((obj: any) => obj['name'] === 'character.njk').object.text
        };

    } else if(get(settings).BACKEND === 'forgejo') {
        //TODO
    }

    return null;
}

export const renderCharacterLayout11ty = async (layouts: any, allData: any) => {

    //remove any frontmatter from the character layout
    let characterLayout = matter(layouts.characterLayout).content;

    let html = nunjucks.renderString(layouts.baseLayout, { content: nunjucks.renderString(characterLayout, allData) })

    return html;

}