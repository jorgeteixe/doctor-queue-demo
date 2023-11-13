export async function load({ fetch }) {
	const response = await fetch('http://localhost:3000/calls');
	return {
		calls: response.json()
	};
}
