<script>
	import { PUBLIC_BASE_URL, PUBLIC_BASE_URL_SOCKET } from '$env/static/public';
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';

	export let data;

	let showModal = false;
	let selectedAppointment = null;

	const callNext = async () => {
		selectedAppointment = data.appointments[0];
		await fetch(`${PUBLIC_BASE_URL}/calls`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ code: selectedAppointment.code })
		});
		showModal = true;
	};

	const call = async (appointment) => {
		selectedAppointment = appointment;
		await fetch(`${PUBLIC_BASE_URL}/calls`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ code: selectedAppointment.code })
		});
		showModal = true;
	};

	const remind = async () => {
		await fetch(`${PUBLIC_BASE_URL}/calls/${selectedAppointment.code}/remind`, { method: 'POST' });
	};

	const arrived = async () => {
		showModal = false;
		data.appointments = data.appointments.filter((a) => a.code !== selectedAppointment.code);
		await fetch(`${PUBLIC_BASE_URL}/calls/${selectedAppointment.code}/arrived`, { method: 'POST' });
	};

	onMount(() => {
		// Initialize Socket.IO client
		const socket = io(PUBLIC_BASE_URL_SOCKET);

		socket.on('connect', () => {
			console.log('Connected to the server');
		});

		socket.on('appointment', (appointment) => {
			console.log('Appointment: ', appointment);
			data.appointments = [...data.appointments, appointment];
		});

		// Handle cleanup
		return () => {
			socket.disconnect();
		};
	});
</script>

<div class="p-6 bg-gray-100 rounded-lg shadow-md max-w-md mx-auto my-10">
	<div class="flex justify-between items-center mb-4">
		<h2 class="text-xl font-bold">Appointment List</h2>
		<button class="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" on:click={callNext}>
			Call next
		</button>
	</div>

	<ul>
		{#each data.appointments as appointment}
			<li class="mb-4 p-4 bg-white rounded shadow-sm flex justify-between items-center">
				<div>
					<p class="font-bold">{appointment.code} - {appointment.name}</p>
					<p>{appointment.type}</p>
				</div>
				<button
					class="px-4 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
					on:click={() => call(appointment)}
				>
					Call
				</button>
			</li>
		{/each}
	</ul>
</div>

{#if showModal && selectedAppointment}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
		<div class="bg-white p-4 rounded-lg shadow-lg max-w-xs w-full">
			<div class="text-center font-bold text-lg mb-4">{selectedAppointment.code}</div>
			<div class="text-center text-3xl font-bold mb-4">{selectedAppointment.type}</div>
			<hr class="my-5" />
			<div class="mb-2"><strong>Name: </strong>{selectedAppointment.name}</div>
			<div class="flex justify-center">
				<button
					class="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
					on:click={arrived}
				>
					Arrived
				</button>
			</div>
		</div>
	</div>
{/if}
