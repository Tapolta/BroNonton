import { fetchUsers } from "$lib/api/fetchUsers.js";
import type { PageLoad } from "./$types.js";

export const load: PageLoad = async({ fetch }) => {
    const users = await fetchUsers(fetch);
    return {users};
}