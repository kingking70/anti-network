// Existing code for other pages (contact form, chat room)
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

// Carousel functionality for projects page
let currentIndex = 0;
const slides = [];

function createProjectCard(item, index) {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.dataset.index = index;
    
    const card = document.createElement('article');
    card.className = 'project-card';
    
    const nameDiv = document.createElement('div');
    nameDiv.innerHTML = `<span class="section-label">who?:</span> ${item.name || ''}`;
    
    const titleDiv = document.createElement('div');
    titleDiv.innerHTML = `<span class="section-label">what?:</span> ${item.title || ''}`;
    
    const projectDiv = document.createElement('div');
    projectDiv.innerHTML = `<span class="section-label">project:</span> ${item.project || ''}`;
    
    const hurdlesDiv = document.createElement('div');
    hurdlesDiv.innerHTML = `<span class="section-label">hurdles:</span> ${item.hurdles || ''}`;
    
    card.appendChild(nameDiv);
    card.appendChild(titleDiv);
    card.appendChild(projectDiv);
    card.appendChild(hurdlesDiv);
    
    if (item.links && item.links.length > 0) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'card-actions';
        item.links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.href;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.textContent = link.label;
            actionsDiv.appendChild(a);
        });
        card.appendChild(actionsDiv);
    }
    
    slide.appendChild(card);
    
    // Add click handler to slide
    slide.addEventListener('click', (e) => {
        // Don't navigate if clicking on a link
        if (e.target.tagName !== 'A') {
            const slideIndex = parseInt(slide.dataset.index);
            if (slideIndex !== currentIndex) {
                goToSlide(slideIndex);
            }
        }
    });
    
    return slide;
}

function initCarousel() {
    const track = document.getElementById('carouselTrack');
    
    // Check if we're on the projects page
    if (!track || !window.__projectCardsData) {
        return;
    }
    
    // Create a shuffled copy of the project data
    const projectData = [...window.__projectCardsData].sort(() => Math.random() - 0.5);
    
    // Create cards
    projectData.forEach((item, index) => {
        const slide = createProjectCard(item, index);
        slides.push(slide);
        track.appendChild(slide);
    });
    
    // Set initial positions
    updateSlidePositions();
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToSlide((currentIndex - 1 + projectData.length) % projectData.length);
        } else if (e.key === 'ArrowRight') {
            goToSlide((currentIndex + 1) % projectData.length);
        }
    });
    
    // Add touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            goToSlide((currentIndex + 1) % projectData.length);
        }
        if (touchEndX > touchStartX + 50) {
            goToSlide((currentIndex - 1 + projectData.length) % projectData.length);
        }
    }
}

function updateSlidePositions() {
    const projectData = window.__projectCardsData;
    slides.forEach((slide, index) => {
        slide.className = 'carousel-slide';
        
        if (index === currentIndex) {
            slide.classList.add('center');
        } else if (index === (currentIndex - 1 + projectData.length) % projectData.length) {
            slide.classList.add('prev');
        } else if (index === (currentIndex + 1) % projectData.length) {
            slide.classList.add('next');
        } else {
            slide.classList.add('hidden');
        }
    });
}

function goToSlide(index) {
    currentIndex = index;
    
    // Update slide positions
    updateSlidePositions();
}

// Initialize carousel when page loads
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
});

// Legacy support for renderProjectCards function (if needed elsewhere)
window.renderProjectCards = function(dataOverride) {
    // This function is kept for backward compatibility
    // The carousel now handles project card rendering
    console.log('renderProjectCards called - carousel handles this now');
};