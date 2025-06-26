<script lang="ts">
	import type { UserProps } from "../../stores/roomWatch.svelte.js";
	import UserCard from "./UserCard.svelte";

    let {userList} = $props<{userList: UserProps[]}>()
</script>

<div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
    <div class="flex items-center justify-between mb-4">
        <h5 class="text-lg font-bold text-gray-800 dark:text-gray-100">Online Users</h5>
        <span class="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {userList.length} online
        </span>
    </div>
    
    <div class="relative">
        <ul class="flex gap-4 pb-2 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar">
            {#each userList as user}
                <li class="snap-start shrink-0">
                    <UserCard username={user.name} />
                </li>
            {/each}
        </ul>
        
        <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent dark:from-gray-800 pointer-events-none"></div>
    </div>
</div>


<style>
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>