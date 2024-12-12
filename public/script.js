const socket = io();
let username = "";

// Handle username submission
document.getElementById('start-chat-button').addEventListener('click', () => {
    username = document.getElementById('username-input').value.trim();

    if (username) {
        document.getElementById('username-container').style.display = 'none';
        document.getElementById('chat-container').style.display = 'flex';
        document.getElementById('user-name-display').textContent = username;

        // Emit an event to notify the server the user has started the chat
        socket.emit('newUser', username);
    } else {
        alert("Please enter a valid username!");
    }
});

// Send message function
document.getElementById('send-button').addEventListener('click', () => {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();

    if (message) {
        const messageData = {
            sender: username,  // Keep track of the sender
            message: message   // Only send the message text (no username)
        };

        // Display the message on the sender's side immediately
        displayMessage(messageData, 'right');

        // Emit the message to the server, do not display it yet on other clients
        socket.emit('chatMessage', messageData);

        // Clear the input field
        messageInput.value = '';
    }
});

// Display incoming message
socket.on('chatMessage', (data) => {
    // Don't display the message if it's the sender's own message
    if (data.sender !== username) {
        displayMessage(data, 'left');
    }
});

// Function to display messages on the UI
function displayMessage(data, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', type);

    const avatar = document.createElement('img');
    avatar.src = type === 'left' ? 'https://randomuser.me/api/portraits/men/1.jpg' : 'https://randomuser.me/api/portraits/men/2.jpg';
    avatar.classList.add(type === 'left' ? 'message-left-avatar' : 'message-right-avatar');

    const textElement = document.createElement('span');
    textElement.textContent = data.message;  // Only show the message content, not the username

    const timestamp = document.createElement('div');
    timestamp.classList.add('timestamp');
    timestamp.textContent = new Date().toLocaleTimeString();

    messageElement.appendChild(avatar);
    messageElement.appendChild(textElement);
    messageElement.appendChild(timestamp);

    document.getElementById('chat-body').appendChild(messageElement);
    document.getElementById('chat-body').scrollTop = document.getElementById('chat-body').scrollHeight;
}

// Exit chat function
function exitChat() {
    document.getElementById('username-container').style.display = 'flex';
    document.getElementById('chat-container').style.display = 'none';
    username = "";
}

