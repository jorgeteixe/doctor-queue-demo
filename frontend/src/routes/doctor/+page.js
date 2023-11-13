export async function load({ fetch }) {
	const response = await fetch('http://localhost:3000/appointments');
	return {
		appointments: response.json()
	};
}
