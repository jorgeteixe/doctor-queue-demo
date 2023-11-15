<script>
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';
	import { PUBLIC_BASE_URL_SOCKET } from '$env/static/public';
	export let data;

	let currentTime = new Date().toLocaleTimeString(['es'], {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	});

	// Update the current time every minute
	onMount(() => {
		const interval = setInterval(() => {
			currentTime = new Date().toLocaleTimeString(['es'], {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			});
		}, 1000);

		// Initialize Socket.IO client
		const socket = io(PUBLIC_BASE_URL_SOCKET);

		socket.on('connect', () => {
			console.log('Connected to the server');
		});

		socket.on('call', (call) => {
			console.log('Call: ', call);
			data.calls = [call, ...data.calls];
		});

		socket.on('arrived', (arrived) => {
			console.log('Arrived: ', arrived);
			data.calls.find((v) => v.code === arrived).arrived = true;
			data.calls = data.calls;
		});

		// Handle cleanup
		return () => {
			clearInterval(interval);
			socket.disconnect();
		};

	});
</script>

<div class="flex flex-row h-screen w-full">
	<div class="flex flex-col justify-around bg-gray-200 w-1/2 h-full py-10">
		<div class="m-5 text-7xl text-center">
			<span class="h-16 w-16 rounded-full bg-blue-500 inline-block mx-1" />Blue room
		</div>
		<div class="text-9xl text-center font-bold">{currentTime}</div>
		<div class="aspect-w-16 aspect-h-9 w-full" style="position:relative;padding-top:56.25%;">
			<iframe
				style="position:absolute;top:0;left:0;width:100%;height:100%;"
				src="https://www.youtube.com/embed/cS9Hrk_IDbE?playlist=cS9Hrk_IDbE&loop=1&autoplay=1&mute=1&controls=0&rel=0&modestbranding=1"
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			/>
		</div>
	</div>
	<div class="w-1/2 p-4 h-screen overflow-hidden">
		<div class="flex justify-around">
			<h2 class="text-4xl font-bold">Code</h2>
			<h2 class="text-4xl font-bold">Door</h2>
		</div>
		<hr class="my-2" />
		<ul>
			{#each data.calls as call, index}
				<div
					class="flex justify-around font-mono mb-4 {call.arrived ? '' : 'blink-animation'} {index % 2 === 0
						? 'bg-gray-200'
						: 'bg-white'}"
				>
					<h2 class="text-8xl font-bold">{call.code}</h2>
					<h2 class="text-8xl">{call.door}</h2>
				</div>
			{/each}
		</ul>
	</div>
</div>

<style>
	@keyframes blink {
		0%,
		100% {
			background-color: transparent;
		}
		50% {
			background-color: #ffcc00;
		}
	}
	.blink-animation {
		animation: blink 1.5s linear infinite;
	}
</style>
