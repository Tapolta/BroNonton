<script lang="ts">
	import { goto } from '$app/navigation';
	import X from '@lucide/svelte/icons/x';
	import PopUpBase from './components/PopUp/PopUpBase.svelte';
	import { fetchUsers } from '$lib/api/fetchUsers.js';

	const startWatchHandle = () => {
		goto('/watch');
	};

	let api = $props();

	let users: any[] = $state(api.data.users);
	let popUpShow: boolean = $state(false);
	let newUsername: string = $state('');

	const addUserHandle = async() => {
		if (newUsername === '' || users.some((user: any) => user.name === newUsername)) {
			popUpShow = false;
			return;
		};

		try {
			const formData = new FormData();
			formData.append('user', JSON.stringify({name: newUsername}));
			const response =  await fetch('http://192.168.28.20:3000/api/user', {
				method: 'POST',
				body: formData,
			});
			const data = await response.json();
			console.log(data)

			refreshUsers();
		} catch (err) {
			console.error(err);
		}
		popUpShow = false;
	}

	const selectUserHandle = async(id: string) => {
		try {
			const response = await fetch(`http://192.168.28.20:3000/api/user/${id}`, {
				method: 'DELETE'
			});

			const data = await response.json();
			console.log(data);

			users.splice(users.findIndex((user: any) => user.id === id), 1);
		} catch (err) {
			console.error(err);
		}
	}

	const refreshUsers = async() => {
		users = await fetchUsers(fetch);
	}

	console.log('[CLIENT] Test:', api.data.users);
</script>


<svelte:head>
	<title>BroNonton</title>
</svelte:head>

<main class="h-screen flex justify-center items-center">
	<div>
		<h1>Pilih User</h1>
		{#if users !== undefined}
			<ul>
				{#each users as user}
					<li class="flex items-center justify-between">
						<button 
							class="flex-1 hover:bg-white/10 text-left"
						>
							
							{user.username}
						</button>
						<button
							onclick={() => selectUserHandle(user._id)}
						>
							<X class="text-red-500 hover:text-red-400"/>
						</button>
					</li>
				{/each}
			</ul>
			<button 
				onclick={() => popUpShow = true}
				class="bg-green-500 px-2 rounded-lg font-semibold">
				Tambah User
			</button>
		{:else}
			<p>Users not found</p>
		{/if}
	</div>
</main>

<PopUpBase 
	popUp={{
		closable: true,
		onClose: () => popUpShow = false,
		size: 'sm',
		visible: popUpShow,
	}}
>
	<h6>Create new user</h6>
	<input 
		placeholder="Input username..."
		class="dark:bg-gray-800"
		bind:value={newUsername}
	/>
	<button
		onclick={addUserHandle}
	>
		Create
	</button>
</PopUpBase>