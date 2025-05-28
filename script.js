// Navbar toggle functionality
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking a link
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Scroll animations for fade-in sections
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optionally unobserve after animation to improve performance
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Job role typewriter with backspace
const jobRoleElement = document.getElementById('job-role');
const roles = ['Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'Web Developer'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeRole() {
    const currentRole = roles[roleIndex];
    jobRoleElement.textContent = currentRole.substring(0, charIndex);

    if (!isDeleting) {
        charIndex++;
        if (charIndex > currentRole.length) {
            isDeleting = true;
            setTimeout(typeRole, 1500); // Pause before deleting
            return;
        }
    } else {
        charIndex--;
        if (charIndex < 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(typeRole, 500); // Pause before next role
            return;
        }
    }

    const delay = isDeleting ? 50 : 100; // Faster delete, slower type
    setTimeout(typeRole, delay);
}

// Start typing animation
typeRole();

// Contact form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Message sent! (This is a placeholder - backend integration required for actual functionality)');
    this.reset();
});

// Full-page Network of Connected Dots Animation
const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');
let dots = [];
let mouse = { x: undefined, y: undefined };

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Dot class
class Dot {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // Size between 1 and 3
        this.speedX = (Math.random() * 2 - 1) * 1; // Speed from previous falling code
        this.speedY = (Math.random() * 2 - 1) * 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = 'rgba(0, 221, 235, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize dots
function initDots() {
    dots = [];
    const numberOfDots = Math.floor((window.innerWidth * window.innerHeight) / 10000); // Scale dots based on screen size
    for (let i = 0; i < numberOfDots; i++) {
        dots.push(new Dot());
    }
}
initDots();

// Track mouse movement
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
});

// Reset mouse position when it leaves the canvas
canvas.addEventListener('mouseleave', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Animation loop
function animateNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw dots
    for (let i = 0; i < dots.length; i++) {
        dots[i].update();
        dots[i].draw();

        // Connect dots to each other
        for (let j = i + 1; j < dots.length; j++) {
            const dx = dots[i].x - dots[j].x;
            const dy = dots[i].y - dots[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) { // Connect if within 100 pixels
                ctx.beginPath();
                ctx.moveTo(dots[i].x, dots[i].y);
                ctx.lineTo(dots[j].x, dots[j].y);
                ctx.strokeStyle = `rgba(0, 221, 235, ${(1 - distance / 100) * 0.3})`;
                ctx.lineWidth = (1 - distance / 100) * 2;
                ctx.stroke();
            }
        }

        // Connect dots to mouse
        if (mouse.x !== undefined && mouse.y !== undefined) {
            const dx = dots[i].x - mouse.x;
            const dy = dots[i].y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) { // Connect to mouse if within 150 pixels
                ctx.beginPath();
                ctx.moveTo(dots[i].x, dots[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(0, 221, 235, ${(1 - distance / 150) * 0.5})`;
                ctx.lineWidth = (1 - distance / 150) * 3;
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animateNetwork);
}
animateNetwork();

// Reinitialize dots on resize
window.addEventListener('resize', () => {
    resizeCanvas();
    initDots();
});