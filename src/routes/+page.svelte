<script lang="ts">
	import Chart from 'chart.js/auto';
	import 'chartjs-adapter-date-fns';
	import { onMount } from 'svelte';
	import '../styles/app.css';

	export let data: any;

	let chart: HTMLCanvasElement;

	Chart.defaults.font.size = 16;
	Chart.defaults.font.family = 'Poppins';

	const options: any = {
		interaction: {
			mode: 'index',
			intersect: false
		},
		plugins: {
			subtitle: {
				display: true,
				text: 'Data fetched from the openweathermap API',
				align: 'start'
			}
		},
		scales: {
			y: {
				display: false
			},
			x: {
				type: 'time',
				time: {
					unit: 'hour',
					displayFormats: {
						hour: 'H:mm'
					}
				}
			},
			A: {
				type: 'linear',
				position: 'left',
				grid: {
					borderColor: '#0054f0'
				},
				display: true,
				title: {
					display: true,
					text: 'Temperature',
					color: '#0054f0',
					font: {
						family: 'Poppins'
					}
				},
				ticks: {
					callback: function (value: string, index: any, ticks: any) {
						return value + ' °C';
					}
				}
			}
		}
	};

	onMount(() => {
		const ctx = chart.getContext('2d');
		const parsedData = data.items
			.filter((entity: any) => entity.temperature !== undefined)
			.map((entity: any) => {
				return {
					x: entity.timestamp,
					y: entity.temperature
				};
			});
		const sortedData = parsedData.sort(
			(a: { x: string | number | Date }, b: { x: string | number | Date }) =>
				new Date(a.x).getTime() - new Date(b.x).getTime()
		);
		if (!ctx) {
			throw new Error('Could not get canvas context');
		}
		new Chart(ctx, {
			type: 'line',

			data: {
				datasets: [
					{
						label: 'Temperature in Turku',
						data: sortedData,
						yAxisID: 'A',
						borderColor: '#0054f0'
					}
				]
			},
			options: options
		});
	});
</script>

<div class="wrapper">
	<h1>Hourly weather in Turku</h1>
	<div id="chart">
		<canvas bind:this={chart}></canvas>
	</div>
</div>

<style>
	#chart {
		width: 70vw;
	}
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100vh;
		padding: 3rem;
		box-sizing: border-box;
		width: fit-content;
	}
	h1 {
		align-self: flex-start;
	}
</style>
