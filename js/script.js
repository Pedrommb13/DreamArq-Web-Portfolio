document.addEventListener('DOMContentLoaded', function() {
    // Load projects from project directories
    loadProjects();

    // Hero background image cycling
    const heroBgs = document.querySelectorAll('.hero-background');
    let currentBgIndex = 0;
    
    function cycleBackgrounds() {
        // Hide all backgrounds
        heroBgs.forEach((bg, index) => {
            bg.style.opacity = 0;
        });
        
        // Show the next background
        currentBgIndex = (currentBgIndex + 1) % heroBgs.length;
        heroBgs[currentBgIndex].style.opacity = 1;
        
        // Call again after delay
        setTimeout(cycleBackgrounds, 5000); // Change image every 5 seconds
    }
    
    // Start the cycling after a delay
    setTimeout(cycleBackgrounds, 5000);
    
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

    // Function to load projects from project directories
    async function loadProjects() {
        try {
            // Fetch the list of project directories
            const response = await fetch('/projects/');
            if (!response.ok) {
                throw new Error('Could not fetch project directories');
            }
            
            // Since we can't directly list directories using fetch in a browser,
            // we'll use a different approach for local development:
            const projectDirs = [
                'Sunrise', 'Essence', 'Paúl', 'Breeze', 'ELO', 'Fazol'
                // Add more project folder names as needed
            ];
            
            const projectsGrid = document.querySelector('.projects-grid');
            projectsGrid.innerHTML = ''; // Clear existing project cards
            
            // Load each project's JSON data and create project cards
            const projectPromises = projectDirs.map(async (dir) => {
                try {
                    const jsonResponse = await fetch(`/projects/${dir}/project.json`);
                    if (!jsonResponse.ok) {
                        console.error(`Could not load project.json for ${dir}`);
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
            
            // Create and append project cards for valid projects
            projects.filter(project => project !== null).forEach(project => {
                const projectCard = createProjectCard(project.dir, project.data);
                projectsGrid.appendChild(projectCard);
            });
            
            // Initialize project filtering after loading projects
            initProjectFilters();
            
        } catch (error) {
            console.error('Error loading projects:', error);
            
            // For local development or GitHub Pages preview, we'll load a sample project
            const projectsGrid = document.querySelector('.projects-grid');
            
            // Fallback: manually load project data from hard-coded values
            // This is temporary until you deploy to GitHub Pages
            loadSampleProjects(projectsGrid);
        }
    }
    
    // Function to create a project card from project data
    function createProjectCard(projectDir, projectData) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-category', projectData.category);
        
        // Construct the image path
        const thumbnailPath = `/projects/${projectDir}/${projectData.thumbnail}`;
        
        card.innerHTML = `
            <img src="${thumbnailPath}" alt="${projectData.name}">
            <div class="project-info">
                <h3>${projectData.name}</h3>
                <p>${projectData.short_description}</p>
                <a href="/projects/${projectDir}/index.html" class="btn-small">View Details</a>
            </div>
        `;
        
        return card;
    }
    
    // Temporary function for local development before deployment
    function loadSampleProjects(projectsGrid) {
        // Clear the grid first
        projectsGrid.innerHTML = '';
        
        // Create and append sample project cards
        sampleProjects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('data-category', project.category);
            
            card.innerHTML = `
                <img src="${project.thumbnail}" alt="${project.name}">
                <div class="project-info">
                    <h3>${project.name}</h3>
                    <p>${project.short_description}</p>
                    <a href="#" class="btn-small project-details" data-project="${project.dir}">View Details</a>
                </div>
            `;
            
            projectsGrid.appendChild(card);
        });
        
        // Add click event listeners to "View Details" buttons
        document.querySelectorAll('.project-details').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const projectDir = this.getAttribute('data-project');
                alert(`Project details for ${projectDir} will be displayed here. In production, this will link to the project's detail page.`);
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
            successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
            
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
                successMessage.textContent = 'Thank you for subscribing to our newsletter!';
                
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
        background-color: #dff0d8;
        border-radius: 4px;
        color: #3c763d;
        text-align: center;
        font-weight: 600;
    }
    
    .loading-message {
        padding: 40px;
        text-align: center;
        color: #777;
        width: 100%;
    }
    
    .loading-message p {
        font-size: 1.2rem;
        margin: 0;
    }
`;

document.head.appendChild(style);
