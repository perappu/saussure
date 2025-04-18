// routes/login/github/callback/+server.ts
import { github } from '$lib/server/auth';
import { token } from '$lib/stores';

import type { RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';

export async function GET(event: RequestEvent): Promise<Response> {
    const code = event.url.searchParams.get('code');
    const state = event.url.searchParams.get('state');
    const storedState = event.cookies.get('github_oauth_state') ?? null;
    if (code === null || state === null || storedState === null) {
        return new Response(null, {
            status: 400
        });
    }
    if (state !== storedState) {
        return new Response(null, {
            status: 400
        });
    }

    let tokens: OAuth2Tokens;
    try {
        tokens = await github.validateAuthorizationCode(code);
    } catch (e) {
        // Invalid code or client credentials
        return new Response(null, {
            status: 400
        });
    }

    event.cookies.set('token', tokens.accessToken(), {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: 'strict'
    });

    return new Response(null, {
        status: 302,
        headers: {
            Location: `/app`
        }
    });
}
