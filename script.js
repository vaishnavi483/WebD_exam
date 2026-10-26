// Global State
let currentStep = 1;
let userProblem = "";
let generatedScenarios = [];
let selectedScenario = null;
let currentImageDataUrl = "";

// OPTIONAL: Add your Gemini API Key here if you want real AI image generation!
// If left blank, it will seamlessly fall back to the dynamic neon canvas generator.
const GEMINI_API_KEY = ""; 

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

    for (let i = 1; i <= 3; i++) {
        const navItem = document.getElementById(`step-nav-${i}`);
        const stepSection = document.getElementById(`step-${i}`);

        if (i === step) {
            if (navItem) navItem.classList.add('active');
            if (stepSection) {
                stepSection.classList.add('active');
                stepSection.style.display = 'block';
            }
        } else {
            if (navItem) navItem.classList.remove('active');
            if (stepSection) {
                stepSection.classList.remove('active');
                stepSection.style.display = 'none';
            }
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

// Generate What-If Scenarios
async function generateWhatIfs() {
    const inputVal = document.getElementById('problem-input').value.trim();
    if (!inputVal) {
        alert("Please share your struggle before continuing!");
        return;
    }

    userProblem = inputVal;
    showLoading("Consulting Multiverse...", "Crafting surreal what-if scenarios for your situation...");

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
    }, 1000);
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
    
    document.querySelectorAll('.scenario-card').forEach(el => el.classList.remove('selected'));
    cardElement.classList.add('selected');

    document.getElementById('btn-visualize').disabled = false;
}

// Visualize Selected Scenario (Gemini API Call + Fallback)
async function visualizeSelectedScenario() {
    if (!selectedScenario) return;

    showLoading("Generating Visual Reality...", "Painting your alternative universe in dark & light pink aesthetics...");

    let generatedImageUrl = null;

    if (GEMINI_API_KEY) {
        try {
            const promptText = `A vibrant surreal digital art illustration matching the concept: ${selectedScenario.title}. Theme: dark background with glowing light pink aesthetic. High detail, cinematic lighting.`;
            
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generateImages:predict?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    instances: [{ prompt: promptText }],
                    parameters: { sampleCount: 1, aspectRatio: "1:1" }
                })
            });

            const data = await response.json();
            if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
                generatedImageUrl = `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
            }
        } catch (err) {
            console.warn("API Call missed or unconfigured, using fallback canvas image generation.", err);
        }
    }

    // Fallback: If no API key or API call failed, generate high quality visual canvas art
    if (!generatedImageUrl) {
        generatedImageUrl = createPlaceholderCanvasArt(selectedScenario.title);
    }

    currentImageDataUrl = generatedImageUrl;

    const imgElement = document.getElementById('generated-image');
    imgElement.src = currentImageDataUrl;
    
    document.getElementById('card-scenario-title').innerText = selectedScenario.title;
    document.getElementById('card-original-text').innerText = `"${userProblem}"`;

    hideLoading();
    goToStep(3);
}

// Dynamic Canvas Image Generator (Guarantees image output)
function createPlaceholderCanvasArt(title) {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 600, 500);
    bgGrad.addColorStop(0, '#0a0a0c');
    bgGrad.addColorStop(0.5, '#1e1322');
    bgGrad.addColorStop(1, '#0a0a0c');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 600, 500);

    // Glowing Pink Abstract Orbs & Rays
    for (let i = 0; i < 8; i++) {
        const x = Math.random() * 600;
        const y = Math.random() * 500;
        const radius = Math.random() * 140 + 40;

        const circleGrad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        circleGrad.addColorStop(0, 'rgba(255, 182, 193, 0.45)');
        circleGrad.addColorStop(0.6, 'rgba(224, 147, 160, 0.15)');
        circleGrad.addColorStop(1, 'rgba(10, 10, 12, 0)');

        ctx.fillStyle = circleGrad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Geometric Decorative Frame
    ctx.strokeStyle = 'rgba(255, 182, 193, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, 540, 440);

    ctx.strokeStyle = 'rgba(255, 182, 193, 0.15)';
    ctx.strokeRect(40, 40, 520, 420);

    // Decorative Stars
    for (let i = 0; i < 25; i++) {
        const sx = Math.random() * 520 + 40;
        const sy = Math.random() * 420 + 40;
        ctx.fillStyle = '#ffd1dc';
        ctx.fillRect(sx, sy, 2, 2);
    }

    // Center Title Text
    ctx.fillStyle = '#ffd1dc';
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(255, 182, 193, 0.8)';
    ctx.shadowBlur = 12;
    ctx.fillText(title, 300, 230);

    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 182, 193, 0.7)';
    ctx.font = '12px monospace';
    ctx.fillText('• PARALLEL UNIVERSE VISUALIZED •', 300, 270);

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
    if (!container) return;
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
