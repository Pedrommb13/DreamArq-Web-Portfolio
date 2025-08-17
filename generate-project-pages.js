const fs = require('fs');
const path = require('path');

// Configuration
const projectsDir = path.join(__dirname, 'projects');
const templateFile = path.join(__dirname, 'project_template.html');

// Function to update existing project pages with image loading functionality
function addImageLoadingToProjectPages() {
  console.log('\n🔄 Adding image loading functionality to existing project pages...');
  
  const projectDirs = fs.readdirSync(projectsDir).filter(dir => 
    fs.statSync(path.join(projectsDir, dir)).isDirectory()
  );

  projectDirs.forEach(dir => {
    const indexPath = path.join(projectsDir, dir, 'index.html');
    
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
        console.log(`✅ Updated image loading for ${dir}/index.html`);
      } catch (error) {
        console.error(`❌ Error updating ${dir}/index.html:`, error);
      }
    }
  });
}

// Function to update existing project pages with dynamic details generation
function addDynamicDetailsToProjectPages() {
  console.log('\n🔄 Adding dynamic details generation to existing project pages...');
  
  const projectDirs = fs.readdirSync(projectsDir).filter(dir => 
    fs.statSync(path.join(projectsDir, dir)).isDirectory()
  );

  // Define the new function to include (with Portuguese translations)
  const newFunction = `
        function generateDetailsListItems(details) {
            if (!details) return '';
            
            // Define display labels for keys
            const detailsLabels = {
                'location': 'Localização',
                'status': 'Estado',
                'type': 'Tipo',
                'style': 'Estilo',
                'year': 'Ano',
                'area': 'Área',
                'client': 'Cliente',
                'architect': 'Arquiteto',
                'budget': 'Orçamento'
                // Add any other fields you might use
            };
            
            // Generate list items for each detail that exists
            let listItems = '';
            for (const key in details) {
                if (details[key]) { // Only include if value exists
                    const label = detailsLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
                    listItems += \`<li><strong>\${label}:</strong> \${details[key]}</li>\\n                            \`;
                }
            }
            
            return listItems;
        }
`;

  projectDirs.forEach(dir => {
    const indexPath = path.join(projectsDir, dir, 'index.html');
    
    if (fs.existsSync(indexPath)) {
      try {
        let content = fs.readFileSync(indexPath, 'utf-8');
        
        // Check if function already exists
        if (!content.includes('function generateDetailsListItems')) {
          // Add the function before getCategoryLabel
          content = content.replace(
            /function getCategoryLabel\(category\)/,
            `${newFunction}\n        function getCategoryLabel(category)`
          );
        }
        
        // Replace the hardcoded details section with dynamic generation
        content = content.replace(
          /<div class="project-details">[\s\S]*?<ul>[\s\S]*?<\/ul>\s*<\/div>/,
          `<div class="project-details">
                        <h2>Detalhes do Projeto</h2>
                        <ul>
                            \${generateDetailsListItems(data.details)}
                        </ul>
                    </div>`
        );
        
        fs.writeFileSync(indexPath, content);
        console.log(`✅ Updated dynamic details for ${dir}/index.html`);
      } catch (error) {
        console.error(`❌ Error updating ${dir}/index.html:`, error);
      }
    }
  });
}

// Function to generate a project page
function generateProjectPage(projectDir, projectData) {
  // Read the template
  const template = fs.readFileSync(templateFile, 'utf8');
  
  // Replace placeholders with actual data
  let pageContent = template
    .replace(/Project Name/g, projectData.name)
    // Keep template literals intact
    .replace(/data-full-src="\${baseUrl}\/projects\/\${projectDir}\/\${image.path}"/g, (match) => {
      // This is just to prevent template literals in the template from being processed here
      return match;
    })
    .replace(/data-caption="\${image.caption}"/g, (match) => {
      // This is just to prevent template literals in the template from being processed here
      return match;
    });
    
  // Generate dynamic details section with only the keys that have values
  const detailsHtml = generateDetailsHtml(projectData.details || {});
  
  // Replace the project details section in the template
  pageContent = pageContent.replace(
    /<div class="project-details">[\s\S]*?<\/div>/,
    `<div class="project-details">
        <h2>Project Details</h2>
        <ul>
            ${detailsHtml}
        </ul>
    </div>`
  );
  
  // Write the HTML file to the project directory
  const outputPath = path.join(projectsDir, projectDir, 'index.html');
  fs.writeFileSync(outputPath, pageContent);
  
  console.log(`Generated page for ${projectData.name} at ${outputPath}`);
}

// Function to generate HTML for project details based on available data
function generateDetailsHtml(details) {
  const detailsMapping = {
    location: 'Localização',
    status: 'Estado',
    type: 'Tipo',
    style: 'Estilo',
    year: 'Ano',
    area: 'Área',
    client: 'Cliente',
    architect: 'Arquiteto',
    budget: 'Orçamento'
  };
  
  let html = '';
  
  // Only generate HTML for fields that exist in the details object
  Object.keys(details).forEach(key => {
    if (details[key] && detailsMapping[key]) {
      html += `<li><strong>${detailsMapping[key]}:</strong> ${details[key]}</li>\n            `;
    }
  });
  
  return html;
}

// Main function to process all project directories
async function processProjects() {
  console.log('🚀 Starting project page generation and updates...\n');
  
  // Get all directories in the projects folder
  const items = fs.readdirSync(projectsDir);
  
  console.log('📄 Generating new project pages from template...');
  for (const item of items) {
    const itemPath = path.join(projectsDir, item);
    
    // Check if it's a directory
    if (fs.statSync(itemPath).isDirectory()) {
      const jsonPath = path.join(itemPath, 'project.json');
      
      // Check if project.json exists
      if (fs.existsSync(jsonPath)) {
        try {
          // Read and parse the JSON file
          const projectData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
          
          // Generate the HTML page for this project
          generateProjectPage(item, projectData);
        } catch (error) {
          console.error(`❌ Error processing ${item}:`, error.message);
        }
      } else {
        console.warn(`⚠️  Warning: No project.json found for ${item}`);
      }
    }
  }
  
  // Update existing pages with image loading functionality
  addImageLoadingToProjectPages();
  
  // Update existing pages with dynamic details generation
  addDynamicDetailsToProjectPages();
  
  console.log('\n✅ All project pages have been generated and updated!');
  console.log('\n📋 Summary:');
  console.log('   • Generated new pages from template');
  console.log('   • Added image loading animations');
  console.log('   • Added dynamic details generation');
  console.log('   • Updated translations to Portuguese');
}

// Run the script
processProjects().catch(console.error);
