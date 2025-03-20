const GITHUB_USERNAME = 'joaopblume'; 
const REPOS_TO_EXCLUDE = ['timer', 'tab-news', 'vmdl', 'Estrutura_de_dados_exercicios', 'lab-natty-or-not', 'migration-oracle-sqlserver', 'binarize_image_dio', 'lab-aws-sagemaker-canvas-estoque'];
const FEATURED_REPOS = ['cloudboosting', 'oVirt-Backup', 'big-workload-ERP-CRM', 'PassiniRelojoaria']; 
const MAX_REPO_AGE_YEARS = 3; 

// Repository topics mapping (customize with your own topics)
const REPO_TOPICS = {
    'frontend': ['react', 'vue', 'angular', 'javascript', 'html', 'css', 'frontend'],
    'backend': ['node', 'express', 'django', 'flask', 'api', 'server', 'backend', 'database', 'virtual-machine'],
    'featured': FEATURED_REPOS
};

// DOM Elements
const projectsGrid = document.getElementById('projects-grid');
const projectsLoading = document.getElementById('projects-loading');
const projectsError = document.getElementById('projects-error');
const projectsEmpty = document.getElementById('projects-empty');
const filterTags = document.querySelectorAll('.filter-tag');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const header = document.getElementById('header');
const contactForm = document.getElementById('contactForm');
const yourName = document.getElementById('yourName');
const currentYear = document.getElementById('currentYear');
const fadeElements = document.querySelectorAll('.fade-in');

// Mobile menu toggle with animation
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link or outside the menu
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !e.target.closest('#navLinks') && 
            !e.target.closest('#menuToggle')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in elements
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all fade-in elements
fadeElements.forEach(element => {
    observer.observe(element);
});

// Header scroll effect with enhanced animation
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Hide scroll indicator when scrolled down
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        if (scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    }
});

// Helper function to check if repo is newer than MAX_REPO_AGE_YEARS
function isRepoNew(createdAt) {
    const repoDate = new Date(createdAt);
    const currentDate = new Date();
    const ageInYears = (currentDate - repoDate) / (1000 * 60 * 60 * 24 * 365.25);
    return ageInYears <= MAX_REPO_AGE_YEARS;
}

// Format date in a more readable way
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Calculate time ago string
function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        return interval === 1 ? '1 year ago' : `${interval} years ago`;
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return interval === 1 ? '1 month ago' : `${interval} months ago`;
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return interval === 1 ? '1 day ago' : `${interval} days ago`;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
    }
    
    return 'Just now';
}

// Update the repository display function to implement the new card design
function displayRepositories(repositories) {
    projectsGrid.innerHTML = '';
    
    if (repositories.length === 0) {
        projectsGrid.style.display = 'none';
        projectsEmpty.style.display = 'block';
        return;
    }
    
    projectsEmpty.style.display = 'none';
    projectsGrid.style.display = 'grid';
    
    repositories.forEach((repo, index) => {
        // Create repository card with fade-in animation
        const card = document.createElement('div');
        card.className = 'project-card fade-in';
        
        // Add featured class if repo is in featured list
        if (FEATURED_REPOS.includes(repo.name)) {
            card.classList.add('featured');
        }
        
        // Calculate time ago for updated date
        const updatedTimeAgo = timeAgo(repo.updated_at);
        
        // Check if custom image exists for this repository
        const repoImage = `./images/${repo.name}.webp`;
        
        // Format topics as tags
        const topicsHTML = repo.topics && repo.topics.length > 0 
            ? `
                <div class="project-topics">
                    ${repo.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join(' ')}
                </div>
            ` 
            : '';
        
        card.innerHTML = `
            <div class="project-image">
                <img 
                    src="${repoImage}" 
                    alt="${repo.name}" 
                    class="contain-fit"
                    onerror="this.onerror=null; this.src='/api/placeholder/600/400'; this.alt='${repo.name} (placeholder)'; this.classList.remove('contain-fit');"
                >
                ${FEATURED_REPOS.includes(repo.name) ? '<div class="featured-badge">Featured</div>' : ''}
            </div>
            <div class="project-details">
                <h3 class="project-title">${repo.name}</h3>
                ${topicsHTML}
                <p class="project-description">${repo.description || 'No description available'}</p>
                <div class="project-meta">
                    <span class="project-date">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        ${updatedTimeAgo}
                    </span>
                </div>
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank" class="project-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        Repository
                    </a>
                    ${repo.homepage ? `
                    <a href="${repo.homepage}" target="_blank" class="project-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        Demo
                    </a>
                    ` : ''}
                </div>
            </div>
        `;
        
        projectsGrid.appendChild(card);
        
        // Add staggered animation delay
        setTimeout(() => {
            observer.observe(card);
        }, 100 * index);
    });
}

// Fetch repositories from GitHub with improved error handling
async function fetchRepositories() {
    try {
        projectsLoading.style.display = 'block';
        projectsGrid.style.display = 'none';
        projectsError.style.display = 'none';
        projectsEmpty.style.display = 'none';
        
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc`);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Failed to fetch repositories: ${errorData.message || response.statusText}`);
        }
        
        const repositories = await response.json();
        
        // Filter out excluded repositories and those older than MAX_REPO_AGE_YEARS
        const filteredRepos = repositories.filter(repo => 
            !REPOS_TO_EXCLUDE.includes(repo.name) && 
            !REPOS_TO_EXCLUDE.includes(repo.description) &&
            !repo.fork && 
            !repo.archived &&
            (FEATURED_REPOS.includes(repo.name) || isRepoNew(repo.created_at)) // Keep featured repos regardless of age
        );
        
        // Sort repositories: featured first, then by updated date
        filteredRepos.sort((a, b) => {
            const aFeatured = FEATURED_REPOS.includes(a.name);
            const bFeatured = FEATURED_REPOS.includes(b.name);
            
            if (aFeatured && !bFeatured) return -1;
            if (!aFeatured && bFeatured) return 1;
            
            return new Date(b.updated_at) - new Date(a.updated_at);
        });
        
        // Store all repositories
        window.allRepositories = filteredRepos;
        
        // Display repositories with 'all' filter
        displayRepositories(filteredRepos);
        
        projectsLoading.style.display = 'none';
        projectsGrid.style.display = 'grid';
        
    } catch (error) {
        console.error('Error fetching repositories:', error);
        projectsLoading.style.display = 'none';
        projectsError.style.display = 'block';
        projectsError.querySelector('p').textContent = error.message || 'Could not load projects. Please check your GitHub username or try again later.';
    }
}

// Display repositories in the grid with enhanced UX
function displayRepositories(repositories) {
    projectsGrid.innerHTML = '';
    
    if (repositories.length === 0) {
        projectsGrid.style.display = 'none';
        projectsEmpty.style.display = 'block';
        return;
    }
    
    projectsEmpty.style.display = 'none';
    projectsGrid.style.display = 'grid';
    
    repositories.forEach((repo, index) => {
        // Create repository card with fade-in animation
        const card = document.createElement('div');
        card.className = 'project-card fade-in';
        
        // Add featured class if repo is in featured list
        if (FEATURED_REPOS.includes(repo.name)) {
            card.classList.add('featured');
        }
        
        // Calculate time ago for updated date
        const updatedTimeAgo = timeAgo(repo.updated_at);
        
        // Check if custom image exists for this repository
        const repoImage = `./images/${repo.name}.webp`;
        
        // Format topics as tags
        const topicsHTML = repo.topics && repo.topics.length > 0 
            ? `
                <div class="project-topics">
                    ${repo.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join(' ')}
                </div>
            ` 
            : '';
        
        card.innerHTML = `
            <div class="project-image">
                <img 
                    src="${repoImage}" 
                    alt="${repo.name}" 
                    class="contain-fit"
                    onerror="this.onerror=null; this.src='/api/placeholder/600/400'; this.alt='${repo.name} (placeholder)'; this.classList.remove('contain-fit');"
                >
                ${FEATURED_REPOS.includes(repo.name) ? '<div class="featured-badge">Featured</div>' : ''}
            </div>
            <div class="project-details">
                <h3 class="project-title">${repo.name}</h3>
                <p class="project-description">${repo.description || 'No description available'}</p>
                ${topicsHTML}
                <div class="project-meta">
                    <span class="project-date">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        ${updatedTimeAgo}
                    </span>
                </div>
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank" class="project-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        Repository
                    </a>
                    ${repo.homepage ? `
                    <a href="${repo.homepage}" target="_blank" class="project-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        Demo
                    </a>
                    ` : ''}
                </div>
            </div>
        `;
        
        projectsGrid.appendChild(card);
        
        // Add staggered animation delay
        setTimeout(() => {
            observer.observe(card);
        }, 100 * index);
    });
}

// Filter repositories by tag
function filterRepositories(tag) {
    if (!window.allRepositories) return;
    
    let filteredRepos;
    
    if (tag === 'all') {
        filteredRepos = window.allRepositories;
    } else {
        filteredRepos = window.allRepositories.filter(repo => {
            // Check if repo is in the tag's list
            if (tag === 'featured' && FEATURED_REPOS.includes(repo.name)) {
                return true;
            }
            
            // Check if repo has topics that match the tag
            const repoTopics = repo.topics || [];
            const tagTopics = REPO_TOPICS[tag] || [];
            
            return repoTopics.some(topic => tagTopics.includes(topic.toLowerCase()));
        });
    }
    
    // Sort repositories: featured first, then by updated date
    filteredRepos.sort((a, b) => {
        const aFeatured = FEATURED_REPOS.includes(a.name);
        const bFeatured = FEATURED_REPOS.includes(b.name);
        
        if (aFeatured && !bFeatured) return -1;
        if (!aFeatured && bFeatured) return 1;
        
        return new Date(b.updated_at) - new Date(a.updated_at);
    });
    
    displayRepositories(filteredRepos);
}

// Add event listeners to filter tags with active state tracking
filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
        // Remove active class from all tags
        filterTags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        
        // Filter repositories
        const tagName = tag.getAttribute('data-tag');
        filterRepositories(tagName);
    });
});

// Contact form handling with form validation
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form fields
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const subjectField = document.getElementById('subject');
        const messageField = document.getElementById('message');
        
        // Basic validation
        let isValid = true;
        const fields = [nameField, emailField, subjectField, messageField];
        
        fields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });
        
        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value.trim())) {
            emailField.classList.add('error');
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // You can add form submission logic here
        // For example, using Formspree:
        // const formData = new FormData(contactForm);
        // await fetch('https://formspree.io/f/your-form-id', {
        //     method: 'POST',
        //     body: formData,
        //     headers: { 'Accept': 'application/json' }
        // });
        
        // Simulate sending (remove this in production)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        submitBtn.textContent = 'Message Sent!';
        submitBtn.classList.add('success');
        
        // Reset the form after delay
        setTimeout(() => {
            contactForm.reset();
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('success');
        }, 3000);
    });
    
    // Add field validation on blur
    const fields = contactForm.querySelectorAll('.form-control');
    fields.forEach(field => {
        field.addEventListener('blur', () => {
            if (!field.value.trim()) {
                field.classList.add('error');
            } else {
                field.classList.remove('error');
                
                // Email specific validation
                if (field.type === 'email') {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(field.value.trim())) {
                        field.classList.add('error');
                    }
                }
            }
        });
        
        // Remove error class when typing
        field.addEventListener('input', () => {
            field.classList.remove('error');
        });
    });
}

// Initialize everything when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Update your name in the hero section
    if (yourName) {
        yourName.textContent = GITHUB_USERNAME;
    }
    
    // Set current year in footer
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    // Fetch repositories
    fetchRepositories();
});
