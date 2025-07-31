// This script updates all project pages to use the dynamic details generation
const fs = require('fs');
const path = require('path');

// Get all project directories
const projectsDir = path.join(__dirname, 'projects');
const projectDirs = fs.readdirSync(projectsDir).filter(dir => 
    fs.statSync(path.join(projectsDir, dir)).isDirectory()
);

console.log(`Found ${projectDirs.length} project directories`);

// Define the new function to include
const newFunction = `
        function generateDetailsListItems(details) {
            if (!details) return '';
            
            // Define display labels for keys
            const detailsLabels = {
                'location': 'Location',
                'status': 'Status',
                'type': 'Type',
                'style': 'Style',
                'year': 'Year',
                'area': 'Area',
                'client': 'Client',
                'architect': 'Architect',
                'budget': 'Budget'
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

// Update each project page
projectDirs.forEach(dir => {
    const indexPath = path.join(projectsDir, dir, 'index.html');
    
    // Check if index.html exists
    if (fs.existsSync(indexPath)) {
        try {
            // Read the current HTML content
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
                        <h2>Project Details</h2>
                        <ul>
                            \${generateDetailsListItems(data.details)}
                        </ul>
                    </div>`
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
