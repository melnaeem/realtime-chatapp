const socket = io('http://localhost:3000');

const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

const userName = document.getElementById('username');


initApp();

function initApp() {
  const name = prompt('what is your name') || 'Anonymous';
  socket.emit('new-user', name);
  appendMessage(`You've joined successfully!`, true);
  userName.innerText = `(${name})`;
};

// message Broadcasted
socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on('user-connected', name => {
  appendMessage(`${name} connected`);
});

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected.`);
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = messageInput.value;
  if (!message) return;
  appendMessage(`You: ${message}`, true);
  socket.emit('send-chat-message', message);
  messageInput.value = '';
});

function appendMessage(message, isMyMsg) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  if (isMyMsg) {
    messageElement.classList.add('myMsg');
  }
  messageContainer.appendChild(messageElement);
};