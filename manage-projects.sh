#!/bin/bash

echo "DreamArq Portfolio - Project Tools"
echo "===================================="
echo

echo "This script helps you manage your architecture portfolio projects."
echo

while true; do
  echo "Choose an option:"
  echo "1. Create metadata for projects without project.json files"
  echo "2. Generate HTML pages for all projects"
  echo "3. Run both actions"
  echo "4. Exit"
  echo
  
  read -p "Enter your choice (1-4): " choice
  
  case $choice in
    1)
      echo
      echo "Creating metadata for projects..."
      node generate-project-metadata.js
      echo
      read -p "Press Enter to continue..."
      ;;
    2)
      echo
      echo "Generating HTML pages for all projects..."
      node generate-project-pages.js
      echo
      read -p "Press Enter to continue..."
      ;;
    3)
      echo
      echo "Creating metadata for projects..."
      node generate-project-metadata.js
      echo
      echo "Generating HTML pages for all projects..."
      node generate-project-pages.js
      echo
      read -p "Press Enter to continue..."
      ;;
    4)
      echo "Goodbye!"
      exit 0
      ;;
    *)
      echo "Invalid choice! Please try again."
      echo
      ;;
  esac
done
