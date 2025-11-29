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
let musicPlayed = false;

function initMusic() {
    backgroundMusic = document.getElementById('backgroundMusic');
    if (!backgroundMusic) {
        console.error('Audio element not found');
        return;
    }
    
    backgroundMusic.volume = 0.5; // Set volume to 50%
    
    // Add error handler to see what's wrong
    backgroundMusic.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        console.error('Error code:', backgroundMusic.error?.code);
        console.error('Error message:', backgroundMusic.error?.message);
    });
    
    // Try to play immediately when audio can play
    backgroundMusic.addEventListener('canplay', () => {
        console.log('Audio can play - attempting to play');
        playMusic();
    }, { once: false });
    
    backgroundMusic.addEventListener('loadeddata', () => {
        console.log('Audio data loaded - attempting to play');
        playMusic();
    }, { once: false });
    
    backgroundMusic.addEventListener('canplaythrough', () => {
        console.log('Audio can play through - attempting to play');
        playMusic();
    }, { once: false });
    
    // Try to play immediately
    playMusic();
    
    // Try multiple times aggressively
    setTimeout(() => playMusic(), 100);
    setTimeout(() => playMusic(), 200);
    setTimeout(() => playMusic(), 300);
    setTimeout(() => playMusic(), 500);
    setTimeout(() => playMusic(), 1000);
    setTimeout(() => playMusic(), 2000);
    
    // Force load the audio
    backgroundMusic.load();
}

// Play music function - tries to play immediately
function playMusic() {
    if (!backgroundMusic) return;
    
    // If already playing, don't try again
    if (musicPlayed && !backgroundMusic.paused) return;
    
    const playPromise = backgroundMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log('Music playing successfully');
            musicPlayed = true;
        }).catch(error => {
            // Only set up interaction listeners if we haven't tried many times yet
            if (!musicPlayed) {
                console.log('Autoplay prevented, will try on interaction');
                setupInteractionListeners();
            }
        });
    } else {
        // If play() returns undefined, try again
        setTimeout(() => playMusic(), 100);
    }
}

// Setup listeners for user interaction
function setupInteractionListeners() {
    const playOnInteraction = () => {
        if (backgroundMusic && !musicPlayed) {
            backgroundMusic.play().then(() => {
                console.log('Music started on user interaction');
                musicPlayed = true;
                // Remove all listeners once playing
                document.removeEventListener('click', playOnInteraction);
                document.removeEventListener('mousemove', playOnInteraction);
                document.removeEventListener('touchstart', playOnInteraction);
                document.removeEventListener('keydown', playOnInteraction);
                document.removeEventListener('scroll', playOnInteraction);
            }).catch(err => {
                console.log('Still cannot play:', err);
            });
        }
    };
    
    document.addEventListener('click', playOnInteraction, { once: true });
    document.addEventListener('mousemove', playOnInteraction, { once: true });
    document.addEventListener('touchstart', playOnInteraction, { once: true });
    document.addEventListener('keydown', playOnInteraction, { once: true });
    document.addEventListener('scroll', playOnInteraction, { once: true });
}

// Envelope click handler
const envelope = document.getElementById('envelope');
const messageOverlay = document.getElementById('messageOverlay');
const closeBtn = document.getElementById('closeBtn');

envelope.addEventListener('click', () => {
    // Ensure music plays when envelope is clicked
    if (backgroundMusic && !musicPlayed) {
        backgroundMusic.play().then(() => {
            musicPlayed = true;
        }).catch(() => {});
    }
    
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

// Initialize music as early as possible
function initializeAll() {
    // Initialize music FIRST and immediately
    initMusic();
    
    // Initialize hearts and sparkles
    initHearts();
    initSparkles();
}

// Try to initialize immediately if script loads after DOM
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded but also try immediately
    initMusic(); // Try music immediately
    document.addEventListener('DOMContentLoaded', initializeAll);
} else {
    // DOM is already loaded - initialize everything immediately
    initializeAll();
}

// Also try music one more time after a short delay
setTimeout(() => {
    if (!musicPlayed && backgroundMusic) {
        playMusic();
    }
}, 50);

