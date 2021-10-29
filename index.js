const express = require('express');
const http = require('http');
const socket = require('socket.io');

const app = express();
const port = process.env.PORT || 3000;

// app.use(express.static('www'));

const httpServer = http.createServer(app);
const io = socket(httpServer, {
    transports: ['websocket'],
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {

    socket.on('join-space', (peerId) => {
        console.log('New user connected', peerId);

        socket.broadcast.emit('user-connected', peerId);

        socket.on('disconnect', () => {
            console.log('User disconnected', peerId);
            socket.broadcast.emit('user-disconnected', peerId)
        });
    });

});

io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});

httpServer.listen(port, () => {
    console.log(`PackSpaces is listening at http://localhost:${port}`);
});
