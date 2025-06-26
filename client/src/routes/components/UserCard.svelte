<script lang="ts">
    let {
        username = "NoName", 
        avatar = "favicon.png"
    } = $props();
</script>

<div class="group relative w-32 h-32 rounded-lg overflow-hidden transition-all duration-200">
    <div class="h-full flex flex-col items-center p-3 bg-white dark:bg-gray-700 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-600 rounded-lg">
        <div class="relative mb-2">
            <img 
                src={avatar} 
                alt={username + "'s avatar"}
                class="w-14 h-14 rounded-full object-cover border border-gray-200 dark:border-gray-600"
            />
        </div>
        
        <h6 class="text-center font-medium text-sm text-gray-800 dark:text-gray-100 line-clamp-2 px-1">
            {username}
        </h6>
        
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors rounded-lg"></div>
    </div>
</div>