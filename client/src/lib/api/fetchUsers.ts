export async function fetchUsers(_fetch: typeof fetch) {
	const res = await _fetch('http://192.168.28.20:3000/api/users');
	if (!res.ok) throw new Error('Failed to fetch users');
	return await res.json();
}
