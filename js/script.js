// Performance enhancement functions - defined globally for accessibility
window.handleImageLoad = function(img) {
    console.log('Image loaded successfully:', img.src);
    const container = img.parentNode;
    container.classList.replace('image-loading', 'image-loaded');
    img.classList.add('loaded');
    
    // Add fade-in effect for better UX
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease-in-out';
    setTimeout(() => {
        img.style.opacity = '1';
    }, 50);
};

window.handleImageError = function(img) {
    console.log('Image failed to load:', img.src);
    const container = img.parentNode;
    container.classList.remove('image-loading');
    container.classList.add('image-error');
    
    // Set a fallback background
    img.style.background = '#f0f0f0';
    img.style.display = 'none';
    
    // Add error indicator
    if (!container.querySelector('.error-indicator')) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-indicator';
        errorDiv.innerHTML = '<i class="fas fa-image"></i><p>Imagem não disponível</p>';
        errorDiv.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #999;
            background: #f9f9f9;
        `;
        container.appendChild(errorDiv);
    }
};

// Sample project data for fallback
const sampleProjects = [
    {
        dir: 'sample1',
        name: 'Projeto Amostra 1',
        category: 'residential',
        thumbnail: 'images/hero-bg-1.png',
        short_description: 'Uma residência moderna com elementos sustentáveis.'
    },
    {
        dir: 'sample2',
        name: 'Projeto Amostra 2',
        category: 'commercial',
        thumbnail: 'images/hero-bg-2.png',
        short_description: 'Espaço comercial inovador com design modular.'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // Get base URL for GitHub Pages compatibility
    const baseUrl = getBaseUrl();
    
    // Check if we're on the main page by looking for the projects section
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        // Only load projects on the main page
        loadProjects(baseUrl);
    }

    // Hero background image cycling
    const heroBgs = document.querySelectorAll('.hero-background');
    let currentBgIndex = 0;
    
    function cycleBackgrounds() {
        // Check if hero backgrounds exist
        if (!heroBgs || heroBgs.length === 0) {
            return; // Exit early if no hero backgrounds found
        }
        
        // Hide all backgrounds
        heroBgs.forEach((bg, index) => {
            if (bg && bg.style) {
                bg.style.opacity = 0;
            }
        });
        
        // Show the next background
        currentBgIndex = (currentBgIndex + 1) % heroBgs.length;
        
        // Check if the current background element exists
        if (heroBgs[currentBgIndex] && heroBgs[currentBgIndex].style) {
            heroBgs[currentBgIndex].style.opacity = 1;
        }
        
        // Call again after delay
        setTimeout(cycleBackgrounds, 5000); // Change image every 5 seconds
    }
    
    // Start the cycling after a delay, but only if hero backgrounds exist
    if (heroBgs && heroBgs.length > 0) {
        setTimeout(cycleBackgrounds, 5000);
    }
    
    // Navigation menu toggle for mobile
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');
        
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger Animation
        burger.classList.toggle('toggle');
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
        });
    });

    // Function to determine the base URL (for GitHub Pages compatibility)
    function getBaseUrl() {
        // Check if we're on GitHub Pages
        const repoName = 'DreamArq-Web-Portfolio';
        const currentUrl = window.location.href;
        
        if (currentUrl.includes('github.io')) {
            // We're on GitHub Pages, return the repository path
            return `/${repoName}`;
        }
        
        // We're on local development or custom domain
        return '';
    }
    
    // Helper function to truncate text
    function truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        
        // Find the last space before the max length to avoid cutting words
        const truncated = text.substring(0, maxLength);
        const lastSpaceIndex = truncated.lastIndexOf(' ');
        
        if (lastSpaceIndex > 0) {
            return truncated.substring(0, lastSpaceIndex) + '...';
        }
        
        return truncated + '...';
    }
    
    // Performance Enhancement Functions have been moved to global scope above
    
    // Intersection Observer for progressive loading
    let observer;
    
    function initializeIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('loaded');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });
        }
    }
    
    function observeElement(element) {
        if (observer) {
            observer.observe(element);
        }
    }
    
    // Initialize performance features when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeIntersectionObserver();
        
        // Preload critical images
        preloadCriticalImages();
        
        // Initialize lazy loading fallback for older browsers
        initializeLazyLoadingFallback();
    });
    
    // Preload critical images (hero background, etc.)
    function preloadCriticalImages() {
        const criticalImages = [
            'images/hero-bg-1.png',
            'images/hero-bg-2.png',
            'images/hero-bg-3.png',
            'images/logo_black_letters.png'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    // Fallback for browsers that don't support lazy loading
    function initializeLazyLoadingFallback() {
        if ('loading' in HTMLImageElement.prototype) {
            return; // Native lazy loading is supported
        }
        
        // Polyfill for older browsers
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        lazyImageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => {
                lazyImageObserver.observe(img);
            });
        } else {
            // Fallback for very old browsers
            lazyImages.forEach(img => {
                img.src = img.dataset.src || img.src;
            });
        }
    }
    
    // Function to load projects from project directories
    async function loadProjects(baseUrl) {
        try {
            // Since we can't directly list directories using fetch in a browser,
            // we'll use a hard-coded array of project directories:
            const projectDirs = [
                'Sunrise', 'Essence', 'Paúl', 'Breeze', 'ELO', 'Fazol'
                // Add more project folder names as needed
            ];
            
            // Get the projects grid with a more specific selector
            const projectsSection = document.getElementById('projects');
            if (!projectsSection) {
                console.error('Projects section not found in the page');
                return;
            }
            
            const projectsGrid = projectsSection.querySelector('.projects-grid');
            if (!projectsGrid) {
                console.error('Project grid element not found in the projects section. Make sure there is an element with class "projects-grid" in the HTML.');
                return;
            }
            
            // Hide loading message if it exists
            const loadingMessage = document.getElementById('loading-projects');
            if (loadingMessage) {
                loadingMessage.style.display = 'none';
            }
            
            projectsGrid.innerHTML = ''; // Clear existing project cards
            
            // Load each project's JSON data and create project cards
            const projectPromises = projectDirs.map(async (dir) => {
                try {
                    // Encode directory name to handle special characters like 'ú'
                    const encodedDir = encodeURIComponent(dir);
                    const jsonUrl = `${baseUrl}/projects/${encodedDir}/project.json`;
                    
                    const jsonResponse = await fetch(jsonUrl);
                    if (!jsonResponse.ok) {
                        console.error(`Could not load project.json for ${dir}. Status: ${jsonResponse.status}`);
                        return null;
                    }
                    
                    const projectData = await jsonResponse.json();
                    return { dir, data: projectData };
                } catch (error) {
                    console.error(`Error loading project ${dir}:`, error);
                    return null;
                }
            });
            
            const projects = await Promise.all(projectPromises);
            
            // Create and append project cards for valid projects with staggered animations
            projects.filter(project => project !== null).forEach((project, index) => {
                const projectCard = createProjectCard(project.dir, project.data, baseUrl);
                
                // Ensure the card has the loaded class for immediate visibility
                projectCard.classList.add('loaded');
                
                // Add staggered loading animation
                projectCard.style.animationDelay = `${index * 0.1}s`;
                projectCard.classList.add('card-loading');
                
                // Make sure the card is visible
                projectCard.style.opacity = '1';
                projectCard.style.display = 'block';
                
                projectsGrid.appendChild(projectCard);
                console.log(`Added project card for ${project.data.name}`);
                
                // Observe for intersection - but don't make it dependent on this
                if (typeof observeElement === 'function') {
                    observeElement(projectCard);
                }
                
                // Remove loading animation after animation completes
                setTimeout(() => {
                    projectCard.classList.remove('card-loading');
                    projectCard.classList.add('loaded');
                }, 800 + (index * 100));
            });
            
            // Initialize project filtering after loading projects
            initProjectFilters();
            
        } catch (error) {
            console.error('Error loading projects:', error);
            
            // For local development or GitHub Pages preview, we'll load a sample project
            const projectsGrid = document.querySelector('.projects-grid');
            if (!projectsGrid) {
                console.error('Project grid element not found for fallback loading.');
                return;
            }
            
            // Hide loading message if it exists
            const loadingMessage = document.getElementById('loading-projects');
            if (loadingMessage) {
                loadingMessage.style.display = 'none';
            }
            
            // Fallback: manually load project data from hard-coded values
            // This is temporary until you deploy to GitHub Pages
            loadSampleProjects(projectsGrid, baseUrl);
        }
    }
    
    // Function to create a project card from project data
    function createProjectCard(projectDir, projectData, baseUrl) {
        const card = document.createElement('div');
        card.className = 'project-card fade-in-up loaded'; // Add 'loaded' class immediately
        card.setAttribute('data-category', projectData.category);
        
        // Encode directory name to handle special characters like 'ú'
        const encodedDir = encodeURIComponent(projectDir);
        
        // Construct the image path with base URL for GitHub Pages compatibility
        const thumbnailPath = `${baseUrl}/projects/${encodedDir}/${projectData.thumbnail}`;
        const projectPageUrl = `${baseUrl}/projects/${encodedDir}/index.html`;
        
        // Truncate description if too long
        const truncatedDescription = truncateText(projectData.short_description, 300);
        
        card.innerHTML = `
            <a href="${projectPageUrl}" class="project-link">
                <div class="image-container image-loading">
                    <img src="${thumbnailPath}" 
                         alt="${projectData.name}" 
                         loading="lazy"
                         onload="if(typeof handleImageLoad === 'function') handleImageLoad(this); else this.parentNode.classList.replace('image-loading', 'image-loaded');"
                         onerror="if(typeof handleImageError === 'function') handleImageError(this); else console.error('Image failed to load');">
                </div>
            </a>
            <div class="project-info">
                <a href="${projectPageUrl}" class="project-title-link">
                    <h3>${projectData.name}</h3>
                </a>
                <p>${truncatedDescription}</p>
                <a href="${projectPageUrl}" class="btn-small">Ver Detalhes</a>
            </div>
        `;
        
        return card;
    }
    
    // Temporary function for local development before deployment
    function loadSampleProjects(projectsGrid, baseUrl) {
        // Clear the grid first
        if (!projectsGrid) {
            console.error('Projects grid element not found');
            return;
        }
        
        projectsGrid.innerHTML = '';
        
        // Create and append sample project cards
        sampleProjects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('data-category', project.category);
            
            // Truncate description if too long
            const truncatedDescription = truncateText(project.short_description, 300);
            
            card.innerHTML = `
                <a href="#" class="project-link project-details" data-project="${project.dir}">
                    <div class="image-container image-loading">
                        <img src="${project.thumbnail}" alt="${project.name}" onload="this.parentNode.classList.replace('image-loading', 'image-loaded')">
                    </div>
                </a>
                <div class="project-info">
                    <a href="#" class="project-title-link project-details" data-project="${project.dir}">
                        <h3>${project.name}</h3>
                    </a>
                    <p>${truncatedDescription}</p>
                    <a href="#" class="btn-small project-details" data-project="${project.dir}">Ver Detalhes</a>
                </div>
            `;
            
            projectsGrid.appendChild(card);
        });
        
        // Add click event listeners to "View Details" buttons
        document.querySelectorAll('.project-details').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const projectDir = this.getAttribute('data-project');
                alert(`Detalhes do projeto ${projectDir} serão exibidos aqui. Em produção, isto irá direcionar para a página de detalhes do projeto.`);
            });
        });
        
        // Initialize the filtering functionality
        initProjectFilters();
    }
    
    // Initialize project filtering functionality
    function initProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projects = document.querySelectorAll('.project-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Show/hide projects based on filter
                projects.forEach(function(project) {
                    if (filterValue === 'all' || project.getAttribute('data-category') === filterValue) {
                        showProject(project);
                    } else {
                        hideProject(project);
                    }
                });
            });
        });
    }
    
    // Show projects function
    function showProject(project) {
        project.style.display = 'block';
        window.setTimeout(function() {
            project.style.opacity = '1';
            project.style.transform = 'scale(1)';
        }, 100);
    }
    
    // Hide projects function
    function hideProject(project) {
        project.style.opacity = '0';
        project.style.transform = 'scale(0.8)';
        window.setTimeout(function() {
            project.style.display = 'none';
        }, 300);
    }

    // Form submission handler
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically add code to handle the form submission
            // For example, using fetch to send the data to a server
            
            // For now, we'll just show a success message
            const formData = new FormData(contactForm);
            let formValues = {};
            
            formData.forEach((value, key) => {
                formValues[key] = value;
            });
            
            console.log('Form submitted with values:', formValues);
            
            // Display a success message
            const successMessage = document.createElement('div');
            successMessage.classList.add('success-message');
            successMessage.textContent = 'Obrigado pela sua mensagem! Entraremos em contato em breve.';
            
            contactForm.innerHTML = '';
            contactForm.appendChild(successMessage);
        });
    }

    // Newsletter subscription handler
    const newsletterForm = document.querySelector('.footer-newsletter form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (email) {
                console.log('Newsletter subscription for:', email);
                
                // Display a success message
                const successMessage = document.createElement('div');
                successMessage.classList.add('success-message');
                successMessage.textContent = 'Obrigado por se inscrever em nossa newsletter!';
                
                newsletterForm.innerHTML = '';
                newsletterForm.appendChild(successMessage);
            }
        });
    }

    // Sticky header
    const header = document.querySelector('header');
    const heroSection = document.querySelector('#hero');
    
    if (header && heroSection) {
        const heroHeight = heroSection.offsetHeight;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > heroHeight - 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Initialize animations on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 50) {
                element.classList.add('animate');
            }
        });
    };
    
    // Add animation classes to elements
    const sectionsToAnimate = document.querySelectorAll('section:not(#hero)');
    sectionsToAnimate.forEach(section => {
        section.classList.add('animate-on-scroll');
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
});

// Additional CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes navLinkFade {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0px);
        }
    }
    
    .toggle .line1 {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .toggle .line2 {
        opacity: 0;
    }
    
    .toggle .line3 {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    .scrolled {
        background-color: rgba(255, 255, 255, 0.98);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .animate-on-scroll.animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    .success-message {
        padding: 20px;
        background-color: #f0f0f0;
        border-radius: 4px;
        color: #000000;
        text-align: center;
        font-weight: 600;
    }
    
    .loading-message {
        padding: 40px;
        text-align: center;
        color: #666666;
        width: 100%;
    }
    
    .loading-message p {
        font-size: 1.2rem;
        margin: 0;
    }
    
    /* Project card link styles */
    .project-link {
        display: block;
        text-decoration: none;
        color: inherit;
        transition: transform 0.3s ease;
    }
    
    .project-link:hover {
        transform: scale(1.02);
    }
    
    .project-title-link {
        text-decoration: none;
        color: inherit;
        transition: color 0.3s ease;
    }
    
    .project-title-link:hover {
        color: var(--secondary-color);
    }
    
    .project-title-link h3 {
        margin: 0;
        transition: color 0.3s ease;
    }
    
    /* Project info layout to position button at bottom */
    .project-info {
        display: flex;
        flex-direction: column;
        min-height: 140px;
        padding: 20px;
    }
    
    .project-info .btn-small {
        margin-top: auto;
        align-self: flex-start;
        display: inline-block;
        background-color: var(--secondary-color);
        color: white;
        padding: 8px 20px;
        border-radius: 4px;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 1px;
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
        text-decoration: none;
        font-size: 0.9rem;
    }
    
    .project-info .btn-small:hover {
        background-color: #666666;
        transform: translateY(-3px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
`;

document.head.appendChild(style);
