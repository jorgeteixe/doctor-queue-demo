import { PUBLIC_BASE_URL } from '$env/static/public';

export async function load({ fetch }) {
	const response = await fetch(`${PUBLIC_BASE_URL}/appointments`);
	return {
		appointments: response.json()
	};
}
