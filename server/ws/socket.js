const WebSocket = require('ws');

let users = [];
global.videoPlayer = {
    play: false,
    time: 0,
}

const setupWebSocket = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('Client connected:', ws.user);
        
        ws.send(JSON.stringify({ type: 'init' }));

        ws.on('message', (message) => {
            const data = JSON.parse(message);
            
            if (data.type === 'init') {
                if (!users.find(u => u.id === data.user.id)) {
                    users.push(data.user);
                    ws.user = data.user;
                    sendMessageClient(wss, {
                        type: 'hasInit', videoPlayer: global.videoPlayer, users
                    });
                }
            }

            if (data.type === 'update') {
                global.videoPlayer.time = data.time;

                if (data.videoStatus !== 'seeked') {
                    global.videoPlayer.play = data.videoStatus !== 'pause';
                }

                sendMessageClient(wss, {
                    sender: data.sender,
                    type: 'update',
                    play: global.videoPlayer.play,
                    time: global.videoPlayer.time,
                })
            }
        });

        ws.on('close', () => {
            console.log('Client disconnected', ws.user ? ws.user : '');
            if (ws.user) {
                users = users.filter(u => u.id !== ws.user.id);
                sendMessageClient(wss, { type: 'userDisconnect', users })
            }
        });
    });

    setInterval(() => {
        if (global.videoPlayer.play) {
            global.videoPlayer.time += 1;
        }
    }, 1000);
}

const sendMessageClient = (wss, data) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            console.log(data);
            client.send(JSON.stringify(data));
        }
    });
};

module.exports = setupWebSocket;
