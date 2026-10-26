// Global State
let currentStep = 1;
let userProblem = "";
let generatedScenarios = [];
let selectedScenario = null;
let currentImageDataUrl = "";

// Sample Feed Initial Data
const sampleGallery = [
    {
        id: '1',
        problem: 'Snoozed my alarm 5 times and missed the 8 AM lecture.',
        scenarioTitle: 'The Dream-Weaver Academy',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
        likes: 24
    },
    {
        id: '2',
        problem: 'Group project teammates went completely ghost on me.',
        scenarioTitle: 'Solo Mastermind Headquarters',
        imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
        likes: 41
    }
];

// On DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
});

// Navigation Controller
function goToStep(step) {
    currentStep = step;

    // Update Step Indicators
    for (let i = 1; i <= 3; i++) {
        const navItem = document.getElementById(`step-nav-${i}`);
        const stepSection = document.getElementById(`step-${i}`);

        if (i === step) {
            navItem.classList.add('active');
            stepSection.classList.add('active');
        } else {
            navItem.classList.remove('active');
            stepSection.classList.remove('active');
        }
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Preset Helper
function applyPreset(text) {
    document.getElementById('problem-input').value = text;
}

// Loading Spinner Helper
function showLoading(title, desc) {
    document.getElementById('loading-title').innerText = title;
    document.getElementById('loading-desc').innerText = desc;
    document.getElementById('loading-overlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.remove('active');
}

// Generate What-If Scenarios (Mock API / AI Integration logic)
async function generateWhatIfs() {
    const inputVal = document.getElementById('problem-input').value.trim();
    if (!inputVal) {
        alert("Please share your struggle before continuing!");
        return;
    }

    userProblem = inputVal;
    showLoading("Consulting Multiverse...", "Crafting surreal what-if scenarios for your situation...");

    // Simulate API delay / Processing response
    setTimeout(() => {
        generatedScenarios = [
            {
                id: 1,
                icon: '🌌',
                title: 'The Hidden Quantum Shift',
                description: `What if ${userProblem.toLowerCase()} was actually a cosmic realignment, steering you away from a boring lecture and toward discovering a breakthrough personal passion?`
            },
            {
                id: 2,
                icon: '⏳',
                title: 'The Time-Bender’s Pause',
                description: `What if this exact moment pause is training your resilience muscles, preparing you to lead the most legendary comeback story on campus?`
            },
            {
                id: 3,
                icon: '✨',
                title: 'The Enchanted Unexpected',
                description: `What if this tiny bump is secretly the opening chapter of a magical adventure where all your accidental mistakes turn into artistic masterpieces?`
            }
        ];

        renderScenarios();
        document.getElementById('recap-text').innerText = `"${userProblem}"`;
        hideLoading();
        goToStep(2);
    }, 1200);
}

// Render Scenario Cards
function renderScenarios() {
    const grid = document.getElementById('scenarios-grid');
    grid.innerHTML = '';
    selectedScenario = null;
    document.getElementById('btn-visualize').disabled = true;

    generatedScenarios.forEach((sc) => {
        const card = document.createElement('div');
        card.className = 'scenario-card';
        card.onclick = () => selectScenario(sc, card);

        card.innerHTML = `
            <div class="scenario-header">
                <span class="scenario-icon">${sc.icon}</span>
                <h3 class="scenario-title">${sc.title}</h3>
            </div>
            <p class="scenario-text">${sc.description}</p>
        `;

        grid.appendChild(card);
    });
}

// Select Scenario Card
function selectScenario(scenario, cardElement) {
    selectedScenario = scenario;
    
    // Highlight UI
    document.querySelectorAll('.scenario-card').forEach(el => el.classList.remove('selected'));
    cardElement.classList.add('selected');

    // Enable button
    document.getElementById('btn-visualize').disabled = false;
}

// Visualize Selected Scenario (Image Generation logic)
async function visualizeSelectedScenario() {
    if (!selectedScenario) return;

    showLoading("Generating Visual Reality...", "Painting your alternative universe in neon dark & light pink aesthetics...");

    // Generate Canvas Abstract Graphic as a placeholder visual
    setTimeout(() => {
        currentImageDataUrl = createPlaceholderCanvasArt(selectedScenario.title);

        document.getElementById('generated-image').src = currentImageDataUrl;
        document.getElementById('card-scenario-title').innerText = selectedScenario.title;
        document.getElementById('card-original-text').innerText = `"${userProblem}"`;

        hideLoading();
        goToStep(3);
    }, 1800);
}

// Dynamic Canvas Fallback Image Generator (Uses theme pink & dark style)
function createPlaceholderCanvasArt(title) {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');

    // Dark Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 600, 500);
    bgGrad.addColorStop(0, '#0a0a0c');
    bgGrad.addColorStop(1, '#231a26');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 600, 500);

    // Neon Pink Glowing Circles
    for (let i = 0; i < 6; i++) {
        const x = Math.random() * 600;
        const y = Math.random() * 500;
        const radius = Math.random() * 120 + 30;

        const circleGrad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        circleGrad.addColorStop(0, 'rgba(255, 182, 193, 0.4)');
        circleGrad.addColorStop(1, 'rgba(255, 182, 193, 0)');

        ctx.fillStyle = circleGrad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Stylized Typography overlay
    ctx.fillStyle = '#ffd1dc';
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, 300, 240);

    ctx.fillStyle = 'rgba(255, 182, 193, 0.6)';
    ctx.font = '14px monospace';
    ctx.fillText('LIFEFLIP PARALLEL UNIVERSE', 300, 270);

    return canvas.toDataURL('image/png');
}

// Publish to Gallery Feed
function publishToFeed() {
    if (!selectedScenario) return;

    const newPost = {
        id: Date.now().toString(),
        problem: userProblem,
        scenarioTitle: selectedScenario.title,
        imageUrl: currentImageDataUrl,
        likes: 1
    };

    sampleGallery.unshift(newPost);
    renderGallery();
    
    alert("✨ Published to the Multiverse Gallery!");
    goToStep(1);
}

// Render Gallery Cards
function renderGallery() {
    const container = document.getElementById('gallery-grid');
    container.innerHTML = '';

    sampleGallery.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'gallery-card glass-panel';

        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.scenarioTitle}">
            <div class="gallery-card-body">
                <h4 class="gallery-card-title">${item.scenarioTitle}</h4>
                <p class="gallery-card-text">"${item.problem}"</p>
                <div class="gallery-card-footer">
                    <span>✨ Parallel Reality</span>
                    <button class="like-btn" onclick="likePost('${item.id}', this)">
                        ❤️ <span>${item.likes}</span>
                    </button>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

// Like Post Helper
function likePost(id, btnElement) {
    const post = sampleGallery.find(p => p.id === id);
    if (post) {
        post.likes += 1;
        btnElement.querySelector('span').innerText = post.likes;
    }
}