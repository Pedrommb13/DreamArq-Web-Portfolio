const fs = require('fs');
const path = require('path');

// Configuration
const projectsDir = path.join(__dirname, 'projects');
const templatePath = path.join(projectsDir, 'project_template.json');

// Function to get image files from a directory
function getImageFiles(dirPath) {
  const files = fs.readdirSync(dirPath);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
  });
}

// Function to generate a project metadata file
function generateProjectMetadata(projectDir) {
  // Read the template
  const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
  
  // Get image files from project directory
  const projectPath = path.join(projectsDir, projectDir);
  const imageFiles = getImageFiles(projectPath);
  
  // Select the first image as thumbnail
  const thumbnail = imageFiles.length > 0 ? imageFiles[0] : '';
  
  // Create images array
  const images = imageFiles.map(file => ({
    path: file,
    caption: `${projectDir} - ${file.replace(/\.[^/.]+$/, "")}`
  }));
  
  // Customize the template for this project
  const projectData = {
    ...template,
    name: projectDir, // Use directory name as project name
    short_description: `${projectDir} architecture project`, // Generic description
    thumbnail: thumbnail,
    images: images
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
  const results = { success: 0, error: 0 };
  
  for (const item of items) {
    const itemPath = path.join(projectsDir, item);
    
    // Skip non-directories and template directory
    if (!fs.statSync(itemPath).isDirectory() || item === 'template') {
      continue;
    }
    
    const jsonPath = path.join(itemPath, 'project.json');
    
    try {
      if (!fs.existsSync(jsonPath)) {
        // Generate new metadata file
        const metadataPath = generateProjectMetadata(item);
        console.log(`Created metadata file: ${metadataPath}`);
        console.log(`Please edit this file to add more details for the ${item} project.`);
      } else {
        // Update existing metadata file
        updateProjectImages(item);
      }
      results.success++;
    } catch (error) {
      console.error(`Error processing ${item}:`, error.message);
      results.error++;
    }
  }
  
  console.log(`All project metadata has been processed! Success: ${results.success}, Errors: ${results.error}`);
}

// Function to update images in an existing project.json file
function updateProjectImages(projectDir) {
  const projectPath = path.join(projectsDir, projectDir);
  const jsonPath = path.join(projectPath, 'project.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.log(`No project.json found for ${projectDir}, creating new one...`);
    return generateProjectMetadata(projectDir);
  }
  
  try {
    // Read existing project data
    const existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    // Get all image files from the project directory
    const imageFiles = getImageFiles(projectPath);
    
    // Create updated images array
    const updatedImages = imageFiles.map(file => {
      // Check if this image is already in the existing data
      const existingImage = existingData.images.find(img => img.path === file);
      
      if (existingImage) {
        return existingImage; // Keep existing data including caption
      } else {
        // Create new image entry with a default caption
        return {
          path: file,
          caption: `${projectDir} - ${file.replace(/\.[^/.]+$/, "")}`
        };
      }
    });
    
    // Update the images array while preserving all other project data
    existingData.images = updatedImages;
    
    // Check if the thumbnail exists in the directory
    const currentThumbnail = existingData.thumbnail;
    if (!imageFiles.includes(currentThumbnail) && imageFiles.length > 0) {
      existingData.thumbnail = imageFiles[0];
      console.log(`Updated thumbnail for ${projectDir} to ${imageFiles[0]}`);
    }
    
    // Write updated data back to file
    fs.writeFileSync(jsonPath, JSON.stringify(existingData, null, 2));
    console.log(`Updated images array for ${projectDir} with ${updatedImages.length} images`);
    return jsonPath;
  } catch (error) {
    console.error(`Error updating images for ${projectDir}:`, error.message);
    return null;
  }
}

// Check for command line arguments
if (process.argv.length > 2) {
  const projectDir = process.argv[2];
  const projectPath = path.join(projectsDir, projectDir);
  
  if (fs.existsSync(projectPath) && fs.statSync(projectPath).isDirectory()) {
    console.log(`Updating images for project: ${projectDir}`);
    updateProjectImages(projectDir);
  } else {
    console.error(`Project directory not found: ${projectPath}`);
  }
} else {
  // Run the full script
  processProjects().catch(console.error);
}
