import matter from 'gray-matter';
import * as nunjucks from 'nunjucks';
import markdownit from 'markdown-it';
import { Liquid } from 'liquidjs';
import Handlebars from 'handlebars';

/**
 * Render a markdown layout. Uses markdown-it
 *
 * @param layouts The layouts to render
 * @param allData The object data to render into the template
 * @returns The rendered html
 */
export const renderMarkdown = (data: any) => {
    return markdownit({ html: true, linkify: true, typographer: true }).render(
        data
    );
};

/**
 * Render a nunjucks layout
 *
 * @param layouts The layouts to render
 * @param allData The object data to render into the template
 * @returns The rendered html
 */
export const renderNunjucks = (layout: any, data: any) => {
    //remove any frontmatter from the layout
    //maybe we can handle this better in the future
    let content = matter(layout).content;

    var env = new nunjucks.Environment();

    //handling for the 11ty template filters
    //you can also do this for other filters that you may run into
    //have them substitute for placeholders, or do the actual handling
    env.addFilter('byCharacter', function (collection, character) {
        return '';
    });
    env.addFilter('byTag', function (collection, character) {
        return '';
    });

    return env.renderString(content, data);
};

/**
 * Render a liquid layout
 *
 * @param layouts The layouts to render
 * @param allData The object data to render into the template
 * @returns The rendered html
 */
export const renderLiquid = (layout: any, data: any) => {
    const engine = new Liquid();

    return engine.parseAndRender(layout, data);
};

/**
 * Render a handlebars layout
 *
 * @param layouts The layouts to render
 * @param allData The object data to render into the template
 * @returns The rendered html
 */
export const renderHandlebars = (layout: any, data: any) => {
    var template = Handlebars.compile(layout);

    return template(data);
};
