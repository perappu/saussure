import { token } from '$lib/stores';
import type { LayoutLoad } from './$types'

// put the token in a store
export const load: LayoutLoad = async ({ data }) => {
  token.set(data.token);
}