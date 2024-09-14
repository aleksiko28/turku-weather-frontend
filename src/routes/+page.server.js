export async function load({ fetch }) {
	const res = await fetch(`/api/getWeatherData`);
	const item = await res.json();
	return { item };
}
