import { deleteObjectS3 } from '$lib/backends/s3.svelte.js';
import { json, type RequestHandler } from '@sveltejs/kit';
import { ALLOWED_USERS, S3_ACCESS_KEY } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {

    if (ALLOWED_USERS && S3_ACCESS_KEY) {
        try {
            let data = await request.json();

            try {
                deleteObjectS3(data.name);
            } catch (ex: any) {
                return json({ status: 500, error: ex });
            }
            return json({ status: 200 });
        } catch (ex: any) {
            return json({ status: 500, error: ex });
        }
    } else {
        return json({ status: 401 });
    }
};
