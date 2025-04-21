import { GitHub } from 'arctic';
import { GH_CLIENT_ID, GH_CLIENT_SECRET } from '$env/static/private';

export const github = new GitHub(GH_CLIENT_ID, GH_CLIENT_SECRET, null);
