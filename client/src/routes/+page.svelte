<script lang="ts">
	import { goto } from "$app/navigation";

	const startWatchHandle = () => {
		goto('/watch')
	}
</script>

<main>
	<button
		onclick={startWatchHandle}
	>
		Mulai menonton!
	</button>
</main>