// Global variable for the user's name
let username = '';

// Show the chat container and set the user's name
document.getElementById('start-chat-button').addEventListener('click', function() {
  username = document.getElementById('username-input').value.trim();
  console.log('Username entered:', username); // Debugging log
  if (username) {
    // Hide the username input section
    document.getElementById('username-container').style.display = 'none';
    // Show the chat UI
    document.getElementById('chat-container').style.display = 'flex';
    // Display username in chat header
    document.getElementById('user-name-display').innerText = username;
    // Load previous messages if any
    loadMessages();
  } else {
    alert('Please enter a username');
  }
});

// Send a message when the "Send" button is clicked
document.getElementById('send-button').addEventListener('click', function() {
  sendMessage();
});

// Allow pressing Enter to send the message
document.getElementById('message-input').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

// Send message function
function sendMessage() {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();

  console.log('Message entered:', message); // Debugging log

  if (message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'right');

    const timestamp = new Date().toLocaleTimeString();
    messageElement.innerHTML = `
      <div class="message-content">
        <span>You: </span>${message}
        <div class="timestamp">${timestamp}</div>
      </div>
    `;

    // Append message to the chat body
    document.querySelector('.chat-body').appendChild(messageElement);

    // Save the message to local storage
    saveMessageToLocalStorage(username, message, timestamp);

    // Clear the input field
    messageInput.value = '';

    // Scroll to the bottom of the chat
    scrollToBottom();
  }
}

// Save message to local storage
function saveMessageToLocalStorage(user, message, timestamp) {
  let messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
  messages.push({ user, message, timestamp });
  localStorage.setItem('chatMessages', JSON.stringify(messages));
}

// Load previous messages from local storage
function loadMessages() {
  let messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
  messages.forEach(function(msg) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', msg.user === username ? 'right' : 'left');
    messageElement.innerHTML = `
      <div class="message-content">
        <span>${msg.user}: </span>${msg.message}
        <div class="timestamp">${msg.timestamp}</div>
      </div>
    `;

    document.querySelector('.chat-body').appendChild(messageElement);
  });

  // Scroll to the bottom when loading old messages
  scrollToBottom();
}

// Scroll to the bottom of the chat window
function scrollToBottom() {
  const chatBody = document.querySelector('.chat-body');
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Listen for when new messages are dynamically added (optional)
document.querySelector('.chat-body').addEventListener('DOMNodeInserted', function() {
  scrollToBottom();
});

