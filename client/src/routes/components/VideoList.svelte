<script lang="ts">
  import CirclePlay from '@lucide/svelte/icons/circle-play';
  import Clock from '@lucide/svelte/icons/clock';
  import SquareMinus from '@lucide/svelte/icons/square-minus';
  import CirclePlus from '@lucide/svelte/icons/circle-plus';
  import SquarePlus from '@lucide/svelte/icons/square-plus';
	import PopUpBase from './PopUp/PopUpBase.svelte';
	import DelVideoPopUp from './PopUp/DelVideoPopUp.svelte';
	import AddVideoPopUp from './PopUp/addVideos/AddVideoPopUp.svelte';

  interface Video {
    id: number;
    title: string;
    duration: string;
    thumbnail: string;
    active?: boolean;
    views: string;
    videoUrl: string;
  }

    let videos: Video[] = $state([
    {
        id: 1,
        title: "Intro to SvelteKit",
        duration: "10:45",
        thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&q=80&auto=format",
        active: true,
        views: "1.2K",
        videoUrl: ''
    },
    {
        id: 2,
        title: "Reactive Statements in Svelte",
        duration: "08:30",
        thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&q=80&auto=format",
        views: "980",
        videoUrl: ''
    }]);

    let showPlaylist: boolean = $state(true);
    let popUpShow: boolean = $state(false);
    let popUpContent: 'add' | 'del' = $state('add');
    
    const selectVideo = (id: number) => {
        videos = videos.map(video => ({
            ...video,
            active: video.id === id
        }));

        const event = new CustomEvent('select', {
            detail: { id }
        });
        dispatchEvent(event);
    }

    const addVideoHandle = () => {
        popUpShow = true;
        popUpContent = 'add';
    }

    const deleteVideoHandle = (id: number) => {
        popUpShow = true;
        popUpContent = 'del';
    }
</script>

<div class="bg-gray-950 p-4 rounded-xl w-full md:max-w-sm space-y-5 shadow-lg border border-gray-800">
  <div class="flex items-center justify-between">
    <h2 class="text-white text-xl font-semibold">Video Playlist</h2>
    <button
      onclick={addVideoHandle}
      class="p-1.5 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-indigo-400 hover:text-indigo-300 flex items-center"
      title="Add Video">
      <CirclePlus class="w-5 h-5"/>
      <span class="sr-only">Add Video</span>
    </button>
  </div>

  <div class={`space-y-2 lg:max-h-96 md:max-h-60 max-h-90 overflow-y-auto pr-1 ${showPlaylist ? '' : 'hidden'} md:block`}>
    {#each videos as video}
      <div class="flex items-center gap-2 hover:bg-gray-900/50 rounded-lg transition-colors duration-200">
        <button
          onclick={() => selectVideo(video.id)}
          class={`flex items-center gap-3 w-full p-3 rounded-lg transition duration-200 ${
            video.active ? 'bg-indigo-900/40 border-l-4 border-indigo-500' : ''
          }`}
        >
          <div class="relative w-16 h-10 shrink-0">
            <img
              src={video.thumbnail}
              alt={video.title}
              class="w-full h-full object-cover rounded-md"
            />
            {#if video.active}
              <span class="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md">
                <CirclePlay class="w-4 h-4 text-white" />
              </span>
            {/if}
          </div>

          <div class="flex-1 min-w-0 text-left">
            <p class="text-white font-medium truncate text-sm">{video.title}</p>
            <div class="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
              <Clock class="w-3 h-3" />
              <span>{video.duration}</span>
            </div>
          </div>
        </button>
        
        <button
          onclick={() => deleteVideoHandle(video.id)}
          class="p-2 mr-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
          title="Delete Video"
          aria-label="Delete video">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    {/each}
  </div>

  <button 
    class="justify-center bg-gray-800 w-full py-2 rounded-lg md:hidden flex items-center gap-2 hover:bg-gray-700 transition-colors duration-200"
    onclick={() => showPlaylist = !showPlaylist}
  >
    {#if showPlaylist}
      <SquareMinus class="w-5 h-5 text-white"/>
      <span class="text-white text-sm">Hide Playlist</span>
    {:else}
      <SquarePlus class="w-5 h-5 text-white"/>
      <span class="text-white text-sm">Show Playlist</span>
    {/if}
  </button>
</div>

<PopUpBase 
    popUp={{
        closable: true, 
        size: 'md', 
        visible: popUpShow, 
        onClose: () => {popUpShow = false},
    }}>
    {#if popUpContent === 'add'}
        <AddVideoPopUp />
    {:else if popUpContent === 'del'}
        <DelVideoPopUp />
    {/if}
</PopUpBase>