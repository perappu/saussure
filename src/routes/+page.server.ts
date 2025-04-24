import { redirect } from '@sveltejs/kit';

//this file exists because otherwise it doesn't redirect properly upon logging in
export function load({ cookies }) {
    const cookieToken = cookies.get('token');

    if (cookieToken) {
        throw redirect(303, '/app');
    }
    
}