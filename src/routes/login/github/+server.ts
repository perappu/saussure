// routes/login/github/+server.ts
import { generateState } from 'arctic';
import { github } from '$lib/config/auth';

import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
    const state = generateState();
    //Change this to 'repo' instead of 'public_repo' to allow access to private repositories
    const url = github.createAuthorizationURL(state, ['public_repo']);

    event.cookies.set('github_oauth_state', state, {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: 'lax'
    });

    return new Response(null, {
        status: 302,
        headers: {
            Location: url.toString()
        }
    });
}
