<script lang="ts">
	import Chart from 'chart.js/auto';
	import 'chartjs-adapter-date-fns';
	import { onMount } from 'svelte';
	import '../styles/app.css';

	export let data: any;

	let chart: HTMLCanvasElement;

	Chart.defaults.font.size = 16;
	Chart.defaults.font.family = 'Poppins';

	const options = {
		interaction: {
			mode: 'index',
			intersect: false
		},
		scales: {
			y: {
				display: false
			},
			x: {
				type: 'time',
				time: {
					unit: 'hour'
				}
			},
			A: {
				type: 'linear',
				position: 'bottom',
				grid: {
					borderColor: '#6730BF'
				},
				display: true,
				title: {
					display: true,
					text: 'Temperature',
					color: '#6730BF',
					font: {
						family: 'Poppins'
					}
				},
				position: 'left',
				ticks: {
					callback: function (value, index, ticks) {
						return value + ' °C';
					}
				}
			}
		}
	};

	onMount(() => {
		const ctx = chart.getContext('2d');
		const parsedData = data.item.entities
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
						label: 'Weather in Turku',
						data: parsedData,
						yAxisID: 'A',
						borderColor: '#6730BF'
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
