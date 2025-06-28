<script lang="ts">
	import AddYouTubePopUp from "./AddYouTubePopUp.svelte";
  import ArrowRight from '@lucide/svelte/icons/arrow-right'

    interface FileInfo {
        name: string;
        size: string;
        file: File;
    };

    interface VideoProps {
      type: 'youtube' | 'mp4';
      title: string;
      roomId: string;
      uploadedBy: string;
      createdAt: Date;
      file?: File
    }

    let uploadMode: 'mp4' | 'youtube' = $state('mp4');
    let youtubeLinks = $state<string[]>([]);

    let fileInfo: FileInfo | null = $state(null);
    let isDragging = $state(false);

    let fileInput: HTMLInputElement | undefined = $state();
    let dropZone: HTMLElement | undefined = $state();

    function handleFileChange(e: Event) {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    }

    function processFile(file: File) {
        if (file.type !== 'application/zip' && !file.name.endsWith('.zip')) {
            alert('Please upload a ZIP file');
            return;
        }

        fileInfo = {
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            file: file
        };
    }

    function removeFile() {
        fileInfo = null;
        if (fileInput) {
            fileInput.value = '';
        }
    }

    function handleDragOver(e: DragEvent) {
        e.preventDefault();
        isDragging = true;
    }

    function handleDragLeave() {
        isDragging = false;
    }

    function handleDrop(e: DragEvent) {
        e.preventDefault();
        isDragging = false;
        
        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    }

    async function uploadPlaylist() {
      if (uploadMode === 'mp4') {
        if (!fileInfo) return;

        try {
            // Here you would implement your actual upload logic
            console.log('Uploading:', fileInfo);
            
            // Example using fetch:
            /*
            const formData = new FormData();
            formData.append('playlistZip', fileInfo.file);
            
            const response = await fetch('/api/upload-playlist', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) throw new Error('Upload failed');
            
            const result = await response.json();
            console.log('Upload successful:', result);
            */
            
            alert('Playlist uploaded successfully!');
            removeFile();
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed. Please try again.');
        }
      } else {
        if (youtubeLinks.length === 0) return;

        const videoData: VideoProps[] = youtubeLinks.map(link => ({
          ...{createdAt: new Date(), roomId: 'room123', type: 'youtube', uploadedBy: 'user123'},
          title: link,
        }));

        const formData = new FormData();
        formData.append('videos', JSON.stringify({ videos: videoData }));

        const response = await fetch('http://192.168.28.20:3000/api/videos', {
          method: 'POST',
          body: formData
        });
      }
    }

    const handleOnAddUrlYoutube = (newYoutubeLinks: string[]) => {
      youtubeLinks = newYoutubeLinks;
    }
</script>

<div class="max-w-lg mx-auto p-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-colors duration-300">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Upload Video Playlist</h1>
      <p class="text-gray-500 dark:text-gray-400">
        {uploadMode === 'mp4' ? 'From ZIP file containing your videos' : 'From YouTube video links'}
      </p>
    </div>
    <div class="flex flex-col items-center gap-1">
      <button 
        class={`px-3 py-1 rounded-md font-medium text-sm transition-colors ${uploadMode === 'mp4' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
        onclick={() => uploadMode = 'mp4'}
      >
        MP4
      </button>
      <button 
        class={`px-3 py-1 rounded-md font-medium text-sm transition-colors ${uploadMode === 'youtube' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
        onclick={() => uploadMode = 'youtube'}
      >
        YouTube
      </button>
    </div>
  </div>

  {#if uploadMode === 'mp4'}
    <div class="mb-8 p-5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
      <p class="font-medium text-gray-700 dark:text-gray-300 mb-3">Required ZIP File Structure:</p>
      <div class="text-sm text-gray-600 dark:text-gray-300 font-mono bg-white dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-600">
        <p class="text-blue-600 dark:text-blue-400">my_playlist.zip</p>
        <p class="ml-4">├── yourvideo_1.mp4</p>
        <p class="ml-4">├── sub_yourvideo_1.mp4</p>
        <p class="ml-4">├── yourvideo_2.mp4</p>
        <p class="ml-4">└── sub_yourvideo_2.mp4</p>
      </div>
    </div>
  {:else}
    <AddYouTubePopUp onAddUrl={handleOnAddUrlYoutube} />
  {/if}

  {#if uploadMode === 'mp4'}
    <div class="space-y-6">
      <div class="flex items-center justify-center w-full">
        <label 
          class="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed {isDragging ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'} rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          ondragover={handleDragOver}
          ondragleave={handleDragLeave}
          ondrop={handleDrop}
          bind:this={dropZone}
        >
          <input 
            id="zip-upload" 
            type="file" 
            class="hidden" 
            accept=".zip" 
            bind:this={fileInput}
            onchange={handleFileChange}
          />
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span class="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">ZIP file containing your videos.</p>
          </div>
        </label>
      </div>

      {#if fileInfo}
        <div class="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span class="text-sm font-medium text-blue-800 dark:text-blue-200 truncate">
              {fileInfo.name}
            </span>
            <button onclick={removeFile} class="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <div class="text-xs text-blue-700 dark:text-blue-300 mt-1">
            {fileInfo.size}
          </div>
        </div>
      {/if}
    </div>
  {/if}

  <button 
    onclick={uploadPlaylist}
    disabled={uploadMode === 'mp4' ? !fileInfo : youtubeLinks.length === 0}
    class="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 
      hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all 
      duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none 
      disabled:transform-none flex justify-center items-center gap-2"
    >
    {uploadMode === 'mp4' ? 'Process Playlist' : 'Process YouTube Links'}
      <ArrowRight />
  </button>
</div>