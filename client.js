const socket = io('http://localhost:3000');


const nameForm = document.getElementById('name-container');
const nameInput = document.getElementById('name-input');

const chatContainer = document.getElementById('chat-container');
const messageForm = document.getElementById('send-container');
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');

const userNameEl = document.getElementById('username');


function initApp(userName) {
  nameForm.style.display = 'none';
  chatContainer.style.display = 'block';

  const name =  userName || 'Anonymous'; // prompt('what is your name') ||
  socket.emit('new-user', name);
  appendMessage(`You've joined successfully!`, true);
  userNameEl.innerText = `(${name})`;
};

nameForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = nameInput.value;
  if (!name) return;
  // initApp(name);
  nameForm.parentElement.appendChild(document.createTextNode('Triggered'));
  return false;
});

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
  return false;
});

function appendMessage(message, isMyMsg) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  if (isMyMsg) {
    messageElement.classList.add('myMsg');
  }
  messageContainer.appendChild(messageElement);
};