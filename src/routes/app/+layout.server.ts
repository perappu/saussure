import type { LayoutServerLoad } from './$types';

// pass the token from hooks.server.ts to +layout.ts so that we can put it in a store
export const load: LayoutServerLoad = async ({ locals }) => {
    return {
        token: locals.token
    };
};
