const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let videoPlayer = {
    play: false,
    time: 0,
};

let users = [];

app.use(cors());
app.use(express.json());

app.get('/api/status', (req, res) => {
  res.json({ status: 'Running', videoPlayer });
});

wss.on('connection', (ws) => {
  console.log('🔌 Client connected');

  ws.send(JSON.stringify({ type: 'init' }));

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'init') {
      if (!users.find(u => u.id === data.user.id)) {
        users.push(data.user);
        ws.user = data.user;
        sendMessageClient({type: 'hasInit', videoPlayer, users: users});
      }
    }

    if (data.type === 'update') {
      console.log(data);

      videoPlayer.time = data.time;

      if (data.videoStatus !== 'seeked') {
        videoPlayer.play = data.videoStatus === 'pause' ? false : true;
      }

     sendMessageClient({
        sender: data.sender,
        type: 'update',
        play: videoPlayer.play,
        time: videoPlayer.time,
      });
    }
  });

  ws.on('close', () => {
    console.log('❌ Client disconnected');

    if (ws.user) {
      users = users.filter(u => u.id !== ws.user.id);

      sendMessageClient({ type: 'userDisconnect', users });
    }
  });
});

const sendMessageClient = (data) => {
   wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
}

setInterval(() => {
  if (videoPlayer.play) {
    videoPlayer.time += 1;
  }
}, 1000);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ Express + WS server running at http://localhost:${PORT}`);
});