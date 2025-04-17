import { redirect, type Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { sequence } from '@sveltejs/kit/hooks';
import { token } from '$lib/stores';

const handleParaglide: Handle = ({ event, resolve }) => paraglideMiddleware(event.request, ({ request, locale }) => {
	event.request = request;

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
	});
});

export const handleToken: Handle = async ({ event, resolve }) => {
	const requestedPath = event.url.pathname;
	const cookieToken = event.cookies.get("token");

	if (requestedPath.includes("/app")) {
		if (!cookieToken) {
			throw redirect(303, "/");
		}
	}

	event.locals.token = cookieToken;

	const response = await resolve(event);

	return response;
};

//you can put cookie val in $session to use it in svelte components
export const getSession = async (event: any) => {
	return {
		token: event.locals.token
	};
};

export const handle: Handle = sequence(handleParaglide, handleToken);
