const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let messages = {};

// Handle incoming messages
io.on('connection', (socket) => {
    let currentUser = '';

    socket.on('newUser', (username) => {
        currentUser = username;
        console.log(`${username} has joined the chat.`);
    });

    socket.on('chatMessage', (data) => {
        // Store messages
        if (!messages[data.sender]) {
            messages[data.sender] = [];
        }
        messages[data.sender].push(data.message);

        // Emit message to all clients
        io.emit('chatMessage', data);
    });

    socket.on('disconnect', () => {
        console.log(`${currentUser} has left the chat.`);
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

