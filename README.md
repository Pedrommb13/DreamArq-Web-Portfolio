# DreamArq Architecture Portfolio Website

A modern, responsive architecture portfolio website built with HTML, CSS, and JavaScript. This website is designed to showcase architectural projects and services in an elegant and professional manner.

## Features

- Responsive design that works on all devices
- Modern and clean user interface
- Project filtering by category
- Contact form
- Newsletter subscription
- Smooth scrolling navigation
- Animations on scroll
- Mobile-friendly navigation

## Getting Started

### Prerequisites

- A GitHub account
- Basic knowledge of HTML, CSS, and JavaScript (for customization)

### Setup for GitHub Pages

1. Clone this repository or use it as a template
2. Upload your own architecture project images to the `images` folder
3. Update the content in `index.html` to reflect your own projects and information
4. Commit and push your changes to GitHub
5. Enable GitHub Pages in your repository settings:
   - Go to your repository on GitHub
   - Click on "Settings"
   - Scroll down to the "GitHub Pages" section
   - Select the branch you want to publish (usually `main`)
   - Save your changes
6. Your site will be published at `https://[your-username].github.io/[repository-name]`

## Customization Guide

### Adding Your Own Projects

1. Open `index.html` and locate the projects section
2. Follow the existing structure to add new project cards:

```html
<div class="project-card" data-category="your-category">
    <img src="images/your-project-image.jpg" alt="Project Description">
    <div class="project-info">
        <h3>Project Title</h3>
        <p>Project description goes here</p>
        <a href="#" class="btn-small">View Details</a>
    </div>
</div>
```

3. Add your project images to the `images` folder

### Updating Colors and Styles

The main color scheme can be modified in the CSS file:

1. Open `css/styles.css`
2. Locate the `:root` section at the top
3. Modify the color variables to match your branding:

```css
:root {
    --primary-color: #your-primary-color;
    --secondary-color: #your-secondary-color;
    --accent-color: #your-accent-color;
    /* other variables */
}
```

### Updating Content

You should update the following content in `index.html`:

1. **Header**: Update the logo text and navigation if needed
2. **Hero Section**: Update the main headline and description
3. **About Section**: Add your own studio description and philosophy
4. **Projects Section**: Add your own architecture projects
5. **Services Section**: Update or add services you offer
6. **Contact Section**: Update contact information and form handling
7. **Footer**: Update copyright information and social media links

## Project Structure

```
DreamArq-Web-Portfolio/
├── css/
│   └── styles.css
├── images/
│   ├── hero-bg.jpg
│   ├── placeholder-about.jpg
│   └── placeholder-project1.jpg (etc.)
├── js/
│   └── script.js
└── index.html
```

## Implementation Notes

### Image Placeholders

Currently, the website uses placeholder references for images. You need to:

1. Add actual images to the `images` folder
2. Update the image paths in `index.html` to point to your actual images

### Form Handling

The contact form and newsletter subscription currently only show a success message but don't actually send data. To implement actual form submission:

1. Set up a form handling service like Formspree, Netlify Forms, or your own backend
2. Update the form submission code in `script.js`

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Icons by [Font Awesome](https://fontawesome.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)
