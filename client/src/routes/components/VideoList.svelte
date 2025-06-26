<script lang="ts">
  import CirclePlay from '@lucide/svelte/icons/circle-play';
  import Clock from '@lucide/svelte/icons/clock';
  import SquareMinus from '@lucide/svelte/icons/square-minus';
  import { createEventDispatcher } from 'svelte';

  interface Video {
    id: number;
    title: string;
    duration: string;
    thumbnail: string;
    active?: boolean;
    views: string;
  }

    let videos: Video[] = $state([
    {
        id: 1,
        title: "Intro to SvelteKit",
        duration: "10:45",
        thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&q=80&auto=format",
        active: true,
        views: "1.2K"
    },
    {
        id: 2,
        title: "Reactive Statements in Svelte",
        duration: "08:30",
        thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&q=80&auto=format",
        views: "980"
    },
    {
        id: 3,
        title: "Svelte Store & Context",
        duration: "14:20",
        thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80&auto=format",
        views: "2.1K"
    },
    {
        id: 4,
        title: "Routing in SvelteKit",
        duration: "09:55",
        thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&q=80&auto=format",
        views: "740"
    },
    {
        id: 5,
        title: "Forms and Validation",
        duration: "11:10",
        thumbnail: "https://images.unsplash.com/photo-1581092334703-906a8f5d0055?w=500&q=80&auto=format",
        views: "1.8K"
    },
    {
        id: 1,
        title: "Intro to SvelteKit",
        duration: "10:45",
        thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&q=80&auto=format",
        active: true,
        views: "1.2K"
    },
    {
        id: 2,
        title: "Reactive Statements in Svelte",
        duration: "08:30",
        thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&q=80&auto=format",
        views: "980"
    },
    {
        id: 3,
        title: "Svelte Store & Context",
        duration: "14:20",
        thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80&auto=format",
        views: "2.1K"
    },
    {
        id: 4,
        title: "Routing in SvelteKit",
        duration: "09:55",
        thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&q=80&auto=format",
        views: "740"
    },
    {
        id: 5,
        title: "Forms and Validation",
        duration: "11:10",
        thumbnail: "https://images.unsplash.com/photo-1581092334703-906a8f5d0055?w=500&q=80&auto=format",
        views: "1.8K"
    }
    ]);

    let showPlaylist: boolean = $state(true);

    const dispatch = createEventDispatcher();

    function selectVideo(id: number) {
        videos = videos.map(video => ({
        ...video,
        active: video.id === id
        }));
        dispatch('select', { id });
    }
</script>

<div 
    class="bg-gray-950 p-4 rounded-xl w-full md:max-w-sm space-y-5 shadow-lg border 
    border-gray-800">
  <div class="text-center">
    <h2 class="text-white text-xl font-semibold">Video Playlist</h2>
  </div>

  <div class={`space-y-3 lg:max-h-96 md:max-h-60 max-h-90 overflow-y-auto pr-1 ${showPlaylist
    ? '' : 'hidden'} md:block`}>
    {#each videos as video}
        <button
            onclick={() => selectVideo(video.id)}
            class={`group flex items-center gap-4 w-full p-3 rounded-lg transition duration-200 ${
            video.active ? 'bg-indigo-900/40 border-l-4 border-indigo-500' : 'hover:bg-gray-800'
            }`}
        >
            <div class="relative w-20 h-12 shrink-0">
            <img
                src={video.thumbnail}
                alt={video.title}
                class="w-full h-full object-cover rounded-md"
            />
            {#if video.active}
                <span class="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md">
                <CirclePlay class="w-5 h-5 text-white" />
                </span>
            {/if}
            </div>

            <div class="flex-1 min-w-0 text-left">
            <p class="text-white font-medium truncate text-sm">{video.title}</p>
            <div class="flex items-center gap-1 text-gray-400 text-xs mt-1">
                <Clock class="w-3 h-3" />
                <span>{video.duration}</span>
            </div>
            </div>
        </button>
    {/each}
  </div>
  <button 
        class="justify-center bg-gray-700 w-full py-1 rounded-lg md:hidden flex"
        onclick={() => showPlaylist = !showPlaylist}
    >
      <SquareMinus class="w-5 h-5 text-white"/>
  </button>
</div>

