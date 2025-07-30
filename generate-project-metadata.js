const fs = require('fs');
const path = require('path');

// Configuration
const projectsDir = path.join(__dirname, 'projects');
const templatePath = path.join(projectsDir, 'project_template.json');

// Function to generate a project metadata file
function generateProjectMetadata(projectDir) {
  // Read the template
  const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
  
  // Customize the template for this project
  const projectData = {
    ...template,
    name: projectDir, // Use directory name as project name
    short_description: `${projectDir} architecture project`, // Generic description
  };
  
  // Write the JSON file to the project directory
  const outputPath = path.join(projectsDir, projectDir, 'project.json');
  fs.writeFileSync(outputPath, JSON.stringify(projectData, null, 2));
  
  console.log(`Generated metadata for ${projectDir} at ${outputPath}`);
  return outputPath;
}

// Main function to process all project directories
async function processProjects() {
  // Get all directories in the projects folder
  const items = fs.readdirSync(projectsDir);
  
  for (const item of items) {
    const itemPath = path.join(projectsDir, item);
    
    // Check if it's a directory and not the template itself
    if (fs.statSync(itemPath).isDirectory() && item !== 'template') {
      const jsonPath = path.join(itemPath, 'project.json');
      
      // Check if project.json doesn't exist
      if (!fs.existsSync(jsonPath)) {
        try {
          // Generate the metadata file for this project
          const metadataPath = generateProjectMetadata(item);
          console.log(`Created metadata file: ${metadataPath}`);
          console.log(`Please edit this file to add more details for the ${item} project.`);
        } catch (error) {
          console.error(`Error creating metadata for ${item}:`, error.message);
        }
      } else {
        console.log(`Metadata already exists for ${item}`);
      }
    }
  }
  
  console.log('All project metadata has been generated or already exists!');
}

// Run the script
processProjects().catch(console.error);
