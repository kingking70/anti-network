// You can add your own JavaScript code here
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        console.log('Form submitted:', { name, email, message });
        alert('Thank you for your message!');
        contactForm.reset();
    });
}

// Chat room logic
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const roomSelector = document.getElementById('room');

function getRoomMessages(room) {
    return JSON.parse(localStorage.getItem('chat_' + room) || '[]');
}

function saveRoomMessages(room, messages) {
    localStorage.setItem('chat_' + room, JSON.stringify(messages));
}

function renderMessages(room) {
    const messages = getRoomMessages(room);
    chatMessages.innerHTML = '';
    messages.forEach(msg => {
        const div = document.createElement('div');
        div.textContent = msg;
        chatMessages.appendChild(div);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleRoomChange() {
    renderMessages(roomSelector.value);
}

if (roomSelector && chatForm && chatInput && chatMessages) {
    renderMessages(roomSelector.value);
    roomSelector.addEventListener('change', handleRoomChange);
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const msg = chatInput.value.trim();
        if (msg) {
            const room = roomSelector.value;
            const messages = getRoomMessages(room);
            messages.push(msg);
            saveRoomMessages(room, messages);
            renderMessages(room);
            chatInput.value = '';
        }
    });
} 