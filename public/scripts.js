// scripts.js
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

sendBtn.addEventListener('click', async () => {
    const message = userInput.value.trim();
    if (message === '') return;

    appendMessage('You: ' + message);
    userInput.value = '';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });
        const data = await response.json();
        if (data && data.reply) {
            appendMessage('ChatGPT: ' + data.reply);
        } else {
            appendMessage('ChatGPT: Sorry, something went wrong.');
        }
    } catch (error) {
        console.error('Error:', error.message);
        appendMessage('ChatGPT: Sorry, something went wrong.');
    }
});

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
