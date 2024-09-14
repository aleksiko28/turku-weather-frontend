export async function load({ fetch }) {
	const res = await fetch(`/getWeatherData`);
	const item = await res.json();
	return { item };
}
