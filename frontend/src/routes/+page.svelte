<script>
	let idNumber = '';
	let showModal = false;
	let appointment = null;

	const submitId = async () => {
		if (!idNumber) return;

		const response = await fetch('http://localhost:3000/appointments', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ idNumber })
		});

		if (response.ok) {
			appointment = await response.json();
			idNumber = '';
			showModal = true;
		} else {
			alert('Error');
		}
	};
</script>

<div class="flex items-center justify-center h-screen bg-gray-100">
	<div class="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
		<h1 class="text-xl mb-4 font-bold text-center">Introduce your ID number</h1>
		<input
			type="text"
			bind:value={idNumber}
			placeholder="Your ID number"
			class="w-full p-2 text-lg border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition-colors mb-4"
		/>
		<button
			class="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
			on:click={submitId}
		>
			Send
		</button>
	</div>
</div>

{#if showModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
		<div class="bg-white p-4 rounded-lg shadow-lg max-w-xs w-full">
			<div class="text-center font-bold text-lg mb-4">Your code</div>
			<div class="text-center text-5xl font-bold mb-4">{appointment.code}</div>
			<hr class="my-5" />
			<div class="mb-2"><strong>Name: </strong>{appointment.name}</div>
			<div class="mb-2">
				<strong>Room:</strong>
				<span class="h-3 w-3 rounded-full bg-blue-500 inline-block mx-1" />Blue
			</div>
			<div class="mb-2">
				<div><strong>Door:</strong> {appointment.door}</div>
			</div>
			<button
				class="mt-2 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
				on:click={() => (showModal = false)}
			>
				Close
			</button>
		</div>
	</div>
{/if}
