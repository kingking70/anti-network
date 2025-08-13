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

// reusable project card renderer
function renderProjectCards(dataOverride) {
  const container = document.getElementById('projects-cards');
  const template = document.getElementById('project-card-template');
  const data = Array.isArray(dataOverride) ? dataOverride : window.__projectCardsData;
  if (!container || !template || !Array.isArray(data)) return;

  container.innerHTML = '';
  data.forEach(item => {
    const node = template.content.cloneNode(true);
    const nameEl = node.querySelector('.friend-name');
    const titleEl = node.querySelector('.project-title');
    const projectEl = node.querySelector('.project');
    const hurdlesEl = node.querySelector('.hurdles');
    const actionsEl = node.querySelector('.card-actions');

    if (nameEl) {
      nameEl.innerHTML = '';
      const span = document.createElement('span');
      span.innerHTML = '<span class="section-label">who?:</span> ' + (item.name || '');
      nameEl.appendChild(span);
    }

    if (titleEl) {
      titleEl.innerHTML = '';
      const span = document.createElement('span');
      span.innerHTML = '<span class="section-label">what?:</span> ' + (item.title || '');
      titleEl.appendChild(span);
    }

    if (projectEl) {
      projectEl.innerHTML = '';
      const span = document.createElement('span');
      span.innerHTML = '<span class="section-label">project:</span> ' + (item.project || '');
      projectEl.appendChild(span);
    }

    if (hurdlesEl) {
      hurdlesEl.innerHTML = '';
      const span = document.createElement('span');
      span.innerHTML = '<span class="section-label">hurdles:</span> ' + (item.hurdles || '');
      hurdlesEl.appendChild(span);
    }

    if (actionsEl && Array.isArray(item.links)) {
      item.links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = link.label;
        actionsEl.appendChild(a);
      });
    }

    container.appendChild(node);
  });
}

document.addEventListener('DOMContentLoaded', function() { renderProjectCards(); });

// expose for reuse elsewhere
window.renderProjectCards = renderProjectCards;