// routes/login/github/callback/+server.ts
import { github } from '$lib/config/auth';
import { error, type RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';
import { ALLOWED_USERS } from '$env/static/private';

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

    const userResponse = await fetch('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${tokens.accessToken()}`
        }
    });
    const username = (await userResponse.json()).login;

    if (ALLOWED_USERS && !ALLOWED_USERS.includes(username)) {
        event.cookies.delete('github_oauth_state', { path: '/' });
        event.cookies.delete('token', { path: '/' });
        return error(
            401,
            'User is not allowed to log into this instance of Saussure. Try hosting your own! You may also want to revoke access to this application in your GitHub account settings.'
        );
    }

    //Same site is strict so this cookie is not vulnerable to XSS attacks
    event.cookies.set('token', tokens.accessToken(), {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: 'strict'
    });

    return new Response(null, {
        status: 302,
        headers: {
            location: `/app`
        }
    });
}
