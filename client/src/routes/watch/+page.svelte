<script lang="ts">
	import type { UserProps } from "../../types/globalTypes.js";
	import UserList from "../components/UserList.svelte";
	import UsernameInput from "../components/UsernameInput.svelte";
	import VideoList from "../components/VideoList.svelte";
	import WsVideo from "../components/WsVideo.svelte";

	let user: UserProps = $state<UserProps>({
		id: '',
		name: '',
	});
	let userList: UserProps[] = $state<UserProps[]>([]);
	let userHasSaveName = $state(false);

	const setUserlist = (newUserList: UserProps[]) => {
		userList = newUserList;
	}
</script>

<svelte:head>
	<title>BroNonton</title>
</svelte:head>

{#if !userHasSaveName}
	<UsernameInput bind:user onSaveName={() => {userHasSaveName = true}} />
{:else}
	<div class="md:flex">
		<WsVideo user={user} onSetUsers={setUserlist} />
		<VideoList />
	</div>
	{#if userList !== undefined}
		<div class="m-2">
			<UserList userList={userList} />
		</div>
	{/if}
{/if}
