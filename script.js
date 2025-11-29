// Create floating hearts with different sizes and colors
const heartEmojis = ['💕', '💖', '💗', '💓', '💝', '💞', '💜', '❤️', '🧡', '💛'];
const heartSizes = ['small', 'medium', 'large'];

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart ' + heartSizes[Math.floor(Math.random() * heartSizes.length)];
    heart.innerHTML = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDelay = Math.random() * 5 + 's';
    heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
    document.querySelector('.hearts-container').appendChild(heart);
    
    // Remove heart after animation
    setTimeout(() => {
        heart.remove();
    }, 20000);
}

// Create sparkles
function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.animationDelay = Math.random() * 3 + 's';
    sparkle.style.animationDuration = (Math.random() * 5 + 5) + 's';
    document.querySelector('.sparkles-container').appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 10000);
}

// Create multiple hearts
function initHearts() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createHeart();
        }, i * 800);
    }
    
    // Continue creating hearts
    setInterval(() => {
        createHeart();
    }, 1500);
}

// Initialize sparkles
function initSparkles() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createSparkle();
        }, i * 200);
    }
    
    setInterval(() => {
        createSparkle();
    }, 500);
}

// Music player - wait for DOM to be ready
let backgroundMusic;

function initMusic() {
    backgroundMusic = document.getElementById('backgroundMusic');
    if (!backgroundMusic) {
        console.error('Audio element not found');
        return;
    }
    
    backgroundMusic.volume = 0.5; // Set volume to 50%
    
    // Try to play when audio is ready
    backgroundMusic.addEventListener('canplaythrough', () => {
        playMusic();
    }, { once: true });
    
    // Also try to play immediately
    playMusic();
}

// Play music function
function playMusic() {
    if (!backgroundMusic) return;
    
    const playPromise = backgroundMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Autoplay prevented, will play on user interaction');
            // If autoplay is blocked, try on any user interaction
            const playOnInteraction = () => {
                if (backgroundMusic) {
                    backgroundMusic.play().catch(() => {});
                }
                document.removeEventListener('click', playOnInteraction);
                document.removeEventListener('mousemove', playOnInteraction);
                document.removeEventListener('touchstart', playOnInteraction);
                document.removeEventListener('keydown', playOnInteraction);
            };
            document.addEventListener('click', playOnInteraction, { once: true });
            document.addEventListener('mousemove', playOnInteraction, { once: true });
            document.addEventListener('touchstart', playOnInteraction, { once: true });
            document.addEventListener('keydown', playOnInteraction, { once: true });
        });
    }
}

// Envelope click handler
const envelope = document.getElementById('envelope');
const messageOverlay = document.getElementById('messageOverlay');
const closeBtn = document.getElementById('closeBtn');

envelope.addEventListener('click', () => {
    envelope.classList.add('opened');
    setTimeout(() => {
        messageOverlay.classList.add('show');
    }, 300);
});

// Close message handler
closeBtn.addEventListener('click', () => {
    messageOverlay.classList.remove('show');
    setTimeout(() => {
        envelope.classList.remove('opened');
    }, 300);
});

// Close when clicking outside the message
messageOverlay.addEventListener('click', (e) => {
    if (e.target === messageOverlay) {
        messageOverlay.classList.remove('show');
        setTimeout(() => {
            envelope.classList.remove('opened');
        }, 300);
    }
});

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize hearts and sparkles
    initHearts();
    initSparkles();
    
    // Initialize music
    initMusic();
});

// Also try if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
} else {
    // DOM is already loaded
    initHearts();
    initSparkles();
    initMusic();
}

