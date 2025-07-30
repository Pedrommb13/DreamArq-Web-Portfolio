// This script adds the image loading functionality to all project pages
// Run it after making changes to ensure all projects have the same loading animation

const fs = require('fs');
const path = require('path');

// Get all project directories
const projectsDir = path.join(__dirname, 'projects');
const projectDirs = fs.readdirSync(projectsDir).filter(dir => 
    fs.statSync(path.join(projectsDir, dir)).isDirectory()
);

console.log(`Found ${projectDirs.length} project directories`);

// Add the image-loading.css link to each project page
projectDirs.forEach(dir => {
    const indexPath = path.join(projectsDir, dir, 'index.html');
    
    // Check if index.html exists
    if (fs.existsSync(indexPath)) {
        try {
            let content = fs.readFileSync(indexPath, 'utf-8');
            
            // Add the image-loading.css if not already there
            if (!content.includes('image-loading.css')) {
                content = content.replace(
                    /<link rel="stylesheet" href="..\/..\/css\/project-detail.css">/,
                    '<link rel="stylesheet" href="../../css/project-detail.css">\n    <link rel="stylesheet" href="../../css/image-loading.css">'
                );
            }
            
            // Update gallery images to use image-container with loading state
            content = content.replace(
                /<div class="gallery-main">\s*<img src="([^"]+)" alt="([^"]+)">/g,
                '<div class="gallery-main">\n                        <div class="image-container image-loading">\n                            <img src="$1" alt="$2" onload="this.parentNode.classList.replace(\'image-loading\', \'image-loaded\')">\n                        </div>'
            );
            
            // Update thumbnails to use image-container with loading state
            content = content.replace(
                /<div class="thumbnail([^"]*)">\s*<img src="([^"]+)" alt="([^"]+)"\s*data-full-src="([^"]+)"\s*data-caption="([^"]+)">/g,
                '<div class="thumbnail$1">\n                            <div class="image-container image-loading">\n                                <img src="$2" alt="$3" data-full-src="$4" data-caption="$5" onload="this.parentNode.classList.replace(\'image-loading\', \'image-loaded\')">\n                            </div>'
            );
            
            // Update the thumbnail click handler code
            content = content.replace(
                /const mainImg = document\.querySelector\('\.gallery-main img'\);\s*mainImg\.src = this\.getAttribute\('data-full-src'\);/g,
                'const mainImgContainer = document.querySelector(\'.gallery-main .image-container\');\n                    const mainImg = mainImgContainer.querySelector(\'img\');\n                    \n                    // Add loading class back\n                    mainImgContainer.classList.replace(\'image-loaded\', \'image-loading\');\n                    \n                    // Set new src to trigger loading\n                    mainImg.src = this.getAttribute(\'data-full-src\');'
            );
            
            fs.writeFileSync(indexPath, content);
            console.log(`Updated ${dir}/index.html`);
        } catch (error) {
            console.error(`Error updating ${dir}/index.html:`, error);
        }
    } else {
        console.log(`No index.html found in ${dir}`);
    }
});

console.log('Update complete!');
