<script lang="ts">
    import X from '@lucide/svelte/icons/x';
    import Video from '@lucide/svelte/icons/video';

    let currentYoutubeLink = $state('');
    let youtubeLinks = $state<string[]>([]);
    let previewYoutubeId: string | null = $state(null);

    let { onAddUrl } = $props<{onAddUrl?: (youtubeLinks: string[]) => void}>();

    const addYoutubeLink = async() => {
        const raw = currentYoutubeLink.trim();
        const id: string | null = extractYoutubeId(raw);
        
        if (id !== null) {
            const isVideoExist = await isYoutubeVideoAvailable(id);
            const isValid = /^[A-Za-z0-9_-]{11}$/.test(id) && isVideoExist;
            const isDuplicate = youtubeLinks.includes(id);

            if (isValid && !isDuplicate) {
                youtubeLinks = [...youtubeLinks, id];
                currentYoutubeLink = '';
                onAddUrl(youtubeLinks);
            }
        }
    }

    const extractYoutubeId = (input: string): string | null => {
        try {
            const url = new URL(input);
            if (url.hostname.includes("youtu.be")) {
                return url.pathname.split('/')[1];
            }
            if (url.hostname.includes("youtube.com")) {
                return url.searchParams.get("v");
            }
        } catch {
            if (/^[A-Za-z0-9_-]{11}$/.test(input)) return input;
        }
        return null;
    }

    const isYoutubeVideoAvailable = (id: string): Promise<boolean> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
            img.onload = () => {
                resolve(img.width !== 120);
            };
            img.onerror = () => {
                resolve(false);
            };
        });
    }

    const removeYoutubeLink = (index: number) => {
        youtubeLinks = youtubeLinks.filter((_, i) => i !== index);
        onAddUrl(youtubeLinks);
    }

    const openPreview = (link: string) => {
        previewYoutubeId = link;
    }

    const closePreview = () => {
        previewYoutubeId = null;
    }
</script>

<div class="mb-8 p-5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 
    dark:border-gray-600">
    <p class="font-medium text-gray-700 dark:text-gray-300 mb-3">Add YouTube Video Links:</p>
    <div class="flex gap-2 mb-3">
    <input
        type="text"
        bind:value={currentYoutubeLink}
        placeholder="https://www.youtube.com/watch?v=..."
        class="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 
        rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 
        focus:ring-blue-500"
    />
    <button
        onclick={addYoutubeLink}
        disabled={!currentYoutubeLink.trim()}
        class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
        Add
    </button>
    </div>
    
    {#if youtubeLinks.length > 0}
    <div class="space-y-2 max-h-60 overflow-y-auto">
        {#each youtubeLinks as link, i}
        <div class="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded 
            border border-gray-200 dark:border-gray-600">
            <span class="text-sm text-gray-700 dark:text-gray-300 truncate">{link}</span>
            <div class="flex items-center justify-center gap-2">
                <button onclick={() => openPreview(link)} class="text-blue-500 hover:underline">
                    Check
                </button>
                <button
                    onclick={() => removeYoutubeLink(i)}
                    class="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    >
                    <X class="w-5"/>
                </button>
            </div>
        </div>
        {/each}
    </div>
    {:else}
    <div class="text-center py-2 text-gray-500 dark:text-gray-400">
        <Video class="mx-auto w-12 h-12 mb-3"/>
        <p>No YouTube links added yet</p>
    </div>
    {/if}
</div>

{#if previewYoutubeId}
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-xl w-full p-8 relative">
      <button
        onclick={closePreview}
        class="absolute top-2 right-2 text-gray-500 hover:text-red-500"
      >
        <X class="w-6 h-6" />
      </button>

        <div class="relative w-full max-w-3xl mx-auto" style="padding-top: 56.25%;">
            <iframe
                title="Preview"
                src={`https://www.youtube.com/embed/${previewYoutubeId}?autoplay=1`}
                class="absolute top-0 left-0 w-full h-full rounded-md"
                frameborder="0"
                allow="autoplay; encrypted-media"
                allowfullscreen
            ></iframe>
        </div>
    </div>
  </div>
{/if}
