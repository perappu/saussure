/**
 * Make REST API request
 *
 * @param url The url endpoint
 * @param method The method to use (put/post/get)
 * @param headers The headers for the request
 * @param data The body of the request
 * @returns The json response
 */
export const makeAPIRequest = async (
    url: string,
    method: string,
    headers: any,
    data: any = null
) => {
    let res;

    try {
        res = await fetch(url, {
            method: method,
            headers: headers,
            body: data
        });

        try {
            let data = await res.json();
            return data;
        } catch (ex: any) {
            throw new Error('Parsing request failed', { cause: ex });
        }
    } catch (ex: any) {
        throw new Error('Request failed', { cause: ex });
    }
};

/**
 * Make GraphQL Request
 *
 * @param url The url endpoint
 * @param headers The headers for the request
 * @param method The query of the request
 * @param variables Variables needed for the request
 * @returns The json response
 */
export const makeGraphQLRequest = async (
    url: string,
    headers: any,
    query: string,
    variables: any = null
) => {
    let res;

    try {
        res = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });

        try {
            let data = await res.json();
            return data;
        } catch (ex: any) {
            throw new Error('GraphQL request parsing failed', { cause: ex });
        }
    } catch (ex: any) {
        throw new Error('GraphQL request failed', { cause: ex });
    }
};
