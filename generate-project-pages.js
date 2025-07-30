const fs = require('fs');
const path = require('path');

// Configuration
const projectsDir = path.join(__dirname, 'projects');
const templateFile = path.join(__dirname, 'project_template.html');

// Function to generate a project page
function generateProjectPage(projectDir, projectData) {
  // Read the template
  const template = fs.readFileSync(templateFile, 'utf8');
  
  // Replace placeholders with actual data
  let pageContent = template
    .replace(/Project Name/g, projectData.name)
    .replace(/data-full-src="\/projects\/\${projectDir}\/\${image.path}"/g, (match) => {
      // This is just to prevent template literals in the template from being processed here
      return match;
    })
    .replace(/data-caption="\${image.caption}"/g, (match) => {
      // This is just to prevent template literals in the template from being processed here
      return match;
    });
  
  // Write the HTML file to the project directory
  const outputPath = path.join(projectsDir, projectDir, 'index.html');
  fs.writeFileSync(outputPath, pageContent);
  
  console.log(`Generated page for ${projectData.name} at ${outputPath}`);
}

// Main function to process all project directories
async function processProjects() {
  // Get all directories in the projects folder
  const items = fs.readdirSync(projectsDir);
  
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
          console.error(`Error processing ${item}:`, error.message);
        }
      } else {
        console.warn(`Warning: No project.json found for ${item}`);
      }
    }
  }
  
  console.log('All project pages have been generated!');
}

// Run the script
processProjects().catch(console.error);
