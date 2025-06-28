<script lang="ts">
  import VideoPlayer from '$lib/VideoPlayer.svelte';
  import { onDestroy, onMount } from 'svelte';
  import Loading from './Loading.svelte';
	import type { UserProps } from '../../types/globalTypes.js';

  interface dataSendProps {
    sender: UserProps,
    type: string,
    time: number,
    videoStatus: string
  }

  let {user, onSetUsers} = 
    $props<{user: UserProps, onSetUsers: (newUserList: UserProps[]) => void}>();
  let ws: WebSocket;
  let wsConnected: boolean = $state(false);
  let player: any;
  let allowSend: boolean = true;
  let checkInterval: number;
  const webSocketServerPath: string = 
    "ws://192.168.28.20:3000";

  const onUserHasSet = () => {
    webSocketConnect();

    checkInterval = setInterval(() => {
    checkWebSocketStatus();
    }, 1000);
  }

  const webSocketConnect = () => {
    if (ws && (ws.readyState === WebSocket.OPEN)) return;

    wsConnected = false;
    ws = new WebSocket(webSocketServerPath);
    
    ws.addEventListener('open', () => {
      wsConnected = true;
    });

    ws.addEventListener('message', (e) => {
      const serverVideoData = JSON.parse(e.data);
      
      if (serverVideoData.type === "init") {
        if (user.id !== '' && user.name !== '') {
          ws?.send(JSON.stringify({type: 'init', user: user}));
        }
      }

      if (serverVideoData.type === "hasInit") {
        onSetUsers(serverVideoData.users);
        if (serverVideoData.videoPlayer.play) {
          player?.play();
          player?.currentTime(serverVideoData.videoPlayer.time);
        } else {
          player?.currentTime(serverVideoData.videoPlayer.time);
          player?.pause();
        }
      }

      if (serverVideoData.type === "update" && serverVideoData.sender.id !== user.id) {
        allowSend = false;
        if (serverVideoData.play) {
          player?.currentTime(serverVideoData.time);
          player?.play();
        } else {
          player?.currentTime(serverVideoData.time);
          player?.pause();
        }
      }

      if (serverVideoData.type === "userDisconnect") {
        onSetUsers(serverVideoData.users);
      }
    });
  }

  const handlePlayerReady = (currentPlayer: any) => {
    onUserHasSet();
    player = currentPlayer;
  }

  const sync = (event: string, currentTime: number) => {
    if (allowSend){
      sendDataToServer({
        data: {
          sender: user,
          time: currentTime,
          type: 'update',
          videoStatus: event,
        }
      });
    } else {
      allowSend = true;
    }
  }

  const sendDataToServer = ({data}: {data: dataSendProps}) => {
    ws?.send(JSON.stringify(data));
  }

  const checkWebSocketStatus = () => {
    if (!ws || ws.readyState === WebSocket.CLOSED || ws.readyState  === WebSocket.CLOSING) {
      webSocketConnect();
    }
  }

  onDestroy(() => {
    clearInterval(checkInterval);
    ws?.close();
  });
</script>

<div class="flex justify-center items-center w-full bg-black rounded-lg">
  <div class="w-full max-w-4xl">
    <VideoPlayer
      src="/video.mp4"
      onPlayerReady={handlePlayerReady}
      sync={sync}
    />
  </div>
</div>

{#if !wsConnected}
  <Loading />
{/if}
