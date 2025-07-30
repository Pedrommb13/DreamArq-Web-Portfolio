# DreamArq Architecture Portfolio Website

A modern, responsive architecture portfolio website built with HTML, CSS, and JavaScript. This website is designed to showcase architectural projects and services in an elegant and professional manner.

## Features

- Responsive design that works on all devices
- Modern and clean user interface
- **Dynamic project loading from directory structure**
- **Automatic generation of project pages**
- Project filtering by category
- Contact form
- Smooth scrolling navigation
- Animations on scroll
- Mobile-friendly navigation
- Hero background image cycling

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

### Adding Your Own Projects (Automated Method)

1. Create a new folder in the `projects` directory with your project name:
   ```
   projects/
     └── YourNewProject/
   ```

2. Add your project images to this folder:
   ```
   projects/
     └── YourNewProject/
         ├── thumbnail.jpg
         ├── image1.jpg
         └── image2.jpg
   ```

3. Create a `project.json` file in your project directory:
   ```json
   {
     "name": "Project Name",
     "short_description": "Brief description for the card",
     "description": "Full project description",
     "category": "residential",
     "thumbnail": "thumbnail.jpg",
     "images": [
       {
         "path": "image1.jpg",
         "caption": "Image caption 1"
       },
       {
         "path": "image2.jpg",
         "caption": "Image caption 2"
       }
     ],
     "details": {
       "location": "City, Country",
       "year": "2024",
       "area": "250 m²",
       "client": "Client Name"
     }
   }
   ```

4. Alternatively, you can run the included script to generate the JSON template:
   ```
   node generate-project-metadata.js
   ```

5. Generate project detail pages by running:
   ```
   node generate-project-pages.js
   ```

The website will automatically load all projects from the `projects` directory without you having to modify any HTML.

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
│   ├── styles.css
│   └── project-detail.css
├── images/
│   ├── logo_black.png
│   ├── logo_black_letters.png
│   ├── logo_white.png
│   └── hero-bg-1.png (etc.)
├── js/
│   └── script.js
├── projects/
│   ├── project_template.json
│   ├── Sunrise/
│   │   ├── project.json
│   │   ├── thumbnail.jpg
│   │   └── other images...
│   ├── Essence/
│   │   ├── project.json
│   │   └── images...
│   └── other project folders...
├── generate-project-metadata.js
├── generate-project-pages.js
├── project_template.html
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
