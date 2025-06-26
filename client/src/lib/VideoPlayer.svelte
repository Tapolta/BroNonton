<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as videojsPkg from 'video.js';
  import 'video.js/dist/video-js.css';

  const videojs = (videojsPkg.default || videojsPkg) as any;

  let videoElement: HTMLVideoElement;
  let player: any;

  let {
    src,
    onPlayerReady = () => {},
    sync = null
  } = $props<{
    src: string,
    onPlayerReady: (player: any) => void,
    sync: (event: string, time: number) => void
  }>();

  onMount(() => {
    player = videojs(videoElement, {
      controls: true,
      fluid: true,
      preload: 'auto',
      sources: [
        {
          src,
          type: 'video/mp4'
        }
      ]
    });

    const readyHandler = () => {
      player.off('loadedmetadata', readyHandler);
      onPlayerReady(player);
    };

    player.one('loadedmetadata', readyHandler);

    player.on('play', () => {
      const time = player.currentTime();
      if (typeof time === 'number') sync?.('play', time);
    });
    player.on('pause', () => {
      const time = player.currentTime();
      if (typeof time === 'number') sync?.('pause', time);
    });
    player.on('seeked', () => {
      const time = player.currentTime();
      if (typeof time === 'number') sync?.('seeked', time);
    });
  });

  onDestroy(() => {
    player?.dispose();
  });
</script>

<div class="w-full aspect-video bg-black"> 
  <video
    bind:this={videoElement}
    class="w-full h-full video-js vjs-default-skin"
    playsinline
  >
    <track
      kind="captions"
      src="sub.vtt"
      srclang="id"
      label="Indonesia"
      default
    />
  </video>
</div>