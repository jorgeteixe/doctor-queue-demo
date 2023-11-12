<script>
	import { onMount } from 'svelte';

	export let data;

	let showModal = false;
	let selectedAppointment = null;

	const callNext = () => {
		selectedAppointment = data.appointments[0];
		showModal = true;
	};

	const call = (appointment) => {
		selectedAppointment = appointment;
		showModal = true;
	};

	const remind = async () => {
		// Replace with your actual API endpoint
		// const response = await fetch('/api/remind', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify({ id: selectedAppointment.id })
		// });
	};

	const arrived = async () => {
		// Replace with your actual API endpoint
		// const response = await fetch('/api/arrived', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify({ id: selectedAppointment.id })
		// });
		data.appointments = data.appointments.filter((a) => a.id !== selectedAppointment.id);
		showModal = false;
	};

	onMount(() => {
		// Initialization logic if needed
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
					<p class="font-bold">{appointment.id} - {appointment.name}</p>
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
			<div class="text-center font-bold text-lg mb-4">{selectedAppointment.id}</div>
			<div class="text-center text-3xl font-bold mb-4">{selectedAppointment.type}</div>
			<hr class="my-5" />
			<div class="mb-2"><strong>Name: </strong>{selectedAppointment.name}</div>
			<div class="flex justify-between">
				<button
					class="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
					on:click={arrived}
				>
					Arrived
				</button>
				<button
					class="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600"
					on:click={remind}
				>
					Remind
				</button>
			</div>
		</div>
	</div>
{/if}
