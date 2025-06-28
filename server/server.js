const express = require('express');
const http = require('http');
const cors = require('cors');
const formidable = require('express-formidable');
const connectDB = require('./config/db');
const videoRoutes = require('./routes/videoRoutes');
const setupWebSocket = require('./ws/socket');

const app = express();
const server = http.createServer(app);

// Koneksi ke MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(formidable());
app.use(express.json());

// API Routes
app.use('/api', videoRoutes);

// WebSocket handler
setupWebSocket(server);

// Mulai server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ Express + WS server running at http://localhost:${PORT}`);
});
