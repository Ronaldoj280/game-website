// Search functionality
const searchInput = document.getElementById('searchInput');
const gameCards = document.querySelectorAll('.game-card');
const categoryBtns = document.querySelectorAll('.category-btn');
const gameSections = document.querySelectorAll('.game-section');
const navBtns = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

let currentCategory = 'all';

// Page Navigation
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const pageId = btn.getAttribute('data-page') + '-page';
        
        // Remove active class from all buttons and pages
        navBtns.forEach(b => b.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked button and corresponding page
        btn.classList.add('active');
        document.getElementById(pageId).classList.add('active');
    });
});

// Search games
if (searchInput) {
    searchInput.addEventListener('input', filterGames);
}

function filterGames() {
    const searchTerm = searchInput.value.toLowerCase();

    gameCards.forEach(card => {
        const gameName = card.getAttribute('data-name').toLowerCase();
        const gameText = card.textContent.toLowerCase();

        if (gameName.includes(searchTerm) || gameText.includes(searchTerm)) {
            card.style.display = '';
            card.style.animation = 'fadeIn 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });

    // Hide empty sections
    gameSections.forEach(section => {
        const visibleCards = section.querySelectorAll('.game-card:not([style*="display: none"])');
        if (visibleCards.length === 0) {
            section.style.display = 'none';
        } else {
            section.style.display = '';
        }
    });
}

// Category filtering
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        currentCategory = btn.getAttribute('data-category');
        filterByCategory();
    });
});

function filterByCategory() {
    gameSections.forEach(section => {
        const category = section.getAttribute('data-category');

        if (currentCategory === 'all') {
            section.classList.remove('hidden');
            section.style.display = '';
        } else if (category === currentCategory) {
            section.classList.remove('hidden');
            section.style.display = '';
        } else {
            section.classList.add('hidden');
            section.style.display = 'none';
        }
    });
}

// Game Suggestion Form
const suggestionForm = document.getElementById('suggestionForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const suggestionsList = document.getElementById('suggestionsList');

if (suggestionForm) {
    suggestionForm.addEventListener('submit', handleSuggestionSubmit);
}

function handleSuggestionSubmit(e) {
    e.preventDefault();

    const gameName = document.getElementById('gameName').value.trim();
    const gameUrl = document.getElementById('gameUrl').value.trim();
    const gameCategory = document.getElementById('gameCategory').value;
    const gameDescription = document.getElementById('gameDescription').value.trim();
    const yourName = document.getElementById('yourName').value.trim();
    const yourEmail = document.getElementById('yourEmail').value.trim();

    // Validation
    if (!gameName || !gameUrl || !gameCategory) {
        showError();
        return;
    }

    // Create suggestion object
    const suggestion = {
        name: gameName,
        url: gameUrl,
        category: gameCategory,
        description: gameDescription || 'No description provided',
        submittedBy: yourName || 'Anonymous',
        email: yourEmail || 'Not provided',
        timestamp: new Date().toLocaleString()
    };

    // Save to localStorage
    let suggestions = JSON.parse(localStorage.getItem('gameSuggestions')) || [];
    suggestions.unshift(suggestion); // Add to beginning of array
    localStorage.setItem('gameSuggestions', JSON.stringify(suggestions));

    // Show success message
    showSuccess();

    // Reset form
    suggestionForm.reset();

    // Update suggestions list
    displaySuggestions();

    // Hide messages after 3 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

function showSuccess() {
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
}

function showError() {
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000);
}

function displaySuggestions() {
    const suggestions = JSON.parse(localStorage.getItem('gameSuggestions')) || [];

    if (suggestions.length === 0) {
        suggestionsList.innerHTML = '<p style="color: #999;">No suggestions yet. Be the first to suggest a game!</p>';
        return;
    }

    suggestionsList.innerHTML = suggestions.map((suggestion, index) => `
        <div class="suggestion-item">
            <strong>🎮 ${suggestion.name}</strong>
            <span style="color: #4ecdc4; font-size: 0.9em;">Category: ${suggestion.category}</span>
            <p style="margin: 10px 0; color: #ccc;">${suggestion.description}</p>
            <a href="${suggestion.url}" target="_blank" style="color: #ff6b6b; text-decoration: none; font-weight: bold;">Visit Game →</a>
            <small>Suggested by: <strong>${suggestion.submittedBy}</strong> on ${suggestion.timestamp}</small>
        </div>
    `).join('');
}

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Load suggestions on page load
window.addEventListener('load', displaySuggestions);

// Initialize
console.log('🎮 Game Central loaded successfully!');
