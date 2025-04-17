// Configuration
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Variables pour l'animation Matrix
let columns = 0;
let drops = [];
let fontSize = 14;
let matrixChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";

// Variables pour les contrôles
let speed = 1;
let minSpeed = 0.2; // Vitesse minimale pour le ralentissement
let density = 0.95; // Probabilité qu'une goutte continue de tomber
let colorScheme = {
    text: '#0f0',
    glow: 'rgba(0, 255, 0, 0.8)',
    fade: 'rgba(0, 0, 0, 0.05)'
};

// Initialisation du canvas
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    columns = Math.floor(canvas.width / fontSize);
    
    // Initialiser les positions de chaque goutte
    drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -canvas.height / fontSize);
    }
}

// Animation principale
function drawMatrix() {
    // Créer un effet de traînée en dessinant un rectangle semi-transparent
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = colorScheme.text;
    ctx.font = fontSize + 'px monospace';
    ctx.shadowColor = colorScheme.glow;
    ctx.shadowBlur = 3;
    
    // Dessiner les caractères
    for (let i = 0; i < columns; i++) {
        // Caractère aléatoire
        const char = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
        
        // Position x et y pour le caractère
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        // Dessiner le caractère
        ctx.fillText(char, x, y);
        
        // Décider si la goutte doit continuer de tomber
        if (y > canvas.height && Math.random() > density) {
            drops[i] = 0;
        } else {
            // Faire tomber la goutte
            drops[i] += speed;
        }
    }
    
    requestAnimationFrame(drawMatrix);
}

// Réaction aux mouvements de la souris
function handleMouseMove(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Créer un effet d'onde autour du curseur
    const columnIndex = Math.floor(mouseX / fontSize);
    
    // Affecter quelques colonnes autour du curseur
    for (let i = -5; i <= 5; i++) {
        const targetColumn = columnIndex + i;
        if (targetColumn >= 0 && targetColumn < columns) {
            // Plus proche du curseur = plus forte influence
            const influence = 1 - Math.abs(i) / 5;
            
            // Calculer la position y relative à la position de la souris
            const targetY = Math.floor(mouseY / fontSize);
            
            // Ajuster la goutte pour qu'elle commence près du curseur
            if (Math.random() < influence * 0.5) {
                drops[targetColumn] = targetY + Math.floor(Math.random() * 5);
            }
        }
    }
}

// Mettre à jour l'affichage de la vitesse
function updateSpeedDisplay() {
    document.getElementById('speedUpBtn').textContent = `Vitesse +: ${speed.toFixed(1)}`;
    document.getElementById('speedDownBtn').textContent = `Vitesse -: ${speed.toFixed(1)}`;
}

// Gestion des clics sur les boutons
document.getElementById('speedUpBtn').addEventListener('click', function() {
    speed = (speed >= 3) ? 3 : speed + 0.2;
    updateSpeedDisplay();
});

document.getElementById('speedDownBtn').addEventListener('click', function() {
    speed = (speed <= minSpeed) ? minSpeed : speed - 0.2;
    updateSpeedDisplay();
});

document.getElementById('densityBtn').addEventListener('click', function() {
    density = (density <= 0.8) ? 0.95 : density - 0.05;
    this.textContent = `Densité: ${Math.round((1-density)*100)}%`;
});

document.getElementById('colorBtn').addEventListener('click', function() {
    // Changer le schéma de couleur
    const schemes = [
        { text: '#0f0', glow: 'rgba(0, 255, 0, 0.8)', fade: 'rgba(0, 0, 0, 0.05)' }, // Vert classique
        { text: '#0ff', glow: 'rgba(0, 255, 255, 0.8)', fade: 'rgba(0, 0, 0, 0.05)' }, // Cyan
        { text: '#f0f', glow: 'rgba(255, 0, 255, 0.8)', fade: 'rgba(0, 0, 0, 0.05)' }, // Magenta
        { text: '#ff0', glow: 'rgba(255, 255, 0, 0.8)', fade: 'rgba(0, 0, 0, 0.05)' }, // Jaune
        { text: '#fff', glow: 'rgba(255, 255, 255, 0.8)', fade: 'rgba(0, 0, 0, 0.05)' } // Blanc
    ];
    
    // Trouver l'index actuel et passer au suivant
    let currentIndex = schemes.findIndex(s => s.text === colorScheme.text);
    currentIndex = (currentIndex + 1) % schemes.length;
    colorScheme = schemes[currentIndex];
    
    // Mettre à jour les couleurs du CSS
    document.documentElement.style.setProperty('--matrix-color', colorScheme.text);
    
    // Mettre à jour le texte et les autres éléments
    const content = document.querySelector('.content');
    content.style.color = colorScheme.text;
    content.style.textShadow = `0 0 5px ${colorScheme.text}`;
    
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.style.color = colorScheme.text;
        btn.style.borderColor = colorScheme.text;
    });
});

// Easter egg : cliquer sur le titre fait "glitcher" l'animation
document.querySelector('h1').addEventListener('click', function() {
    // Effet de glitch temporaire
    const originalDensity = density;
    density = 0.5;
    matrixChars = "ERROR404MATRIXBREACH";
    
    setTimeout(() => {
        density = originalDensity;
        matrixChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    }, 2000);
});

// Gestionnaire de redimensionnement de fenêtre
window.addEventListener('resize', initCanvas);

// Gestionnaire de mouvement de souris
canvas.addEventListener('mousemove', handleMouseMove);

// Initialiser et démarrer l'animation
initCanvas();
updateSpeedDisplay();
drawMatrix();
