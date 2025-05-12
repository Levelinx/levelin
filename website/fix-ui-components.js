#!/usr/bin/env node

/**
 * Global Fix Script for Radix UI Components
 *
 * This script helps fix TypeScript compatibility issues with Radix UI components
 * by updating imports and replacing React.ElementRef with concrete HTML element types.
 *
 * Usage:
 * 1. Save this file as fix-ui-components.js in your project root
 * 2. Run: node fix-ui-components.js
 */

const fs = require("fs");
const path = require("path");

// Configuration
const UI_COMPONENTS_DIR = path.join(process.cwd(), "app", "components", "ui");
const IMPORT_PATH_REGEX = /@\/components\/ui\/([a-zA-Z-]+)/g;
const CORRECT_IMPORT_PATH = "@/app/components/ui/";
const ELEMENT_REF_REGEX = /React\.ElementRef<typeof ([a-zA-Z0-9.]+)>/g;

// HTML element type mapping for Radix UI components
const COMPONENT_TO_HTML_TYPE = {
  // Default mappings
  default: "HTMLDivElement",

  // Specific mappings
  Input: "HTMLInputElement",
  Button: "HTMLButtonElement",
  Checkbox: "HTMLInputElement",
  RadioGroup: "HTMLDivElement",
  Select: "HTMLSelectElement",
  Textarea: "HTMLTextAreaElement",
  Toggle: "HTMLButtonElement",
  Label: "HTMLLabelElement",

  // Add more mappings as needed
};

// Helper function to get HTML element type for a component
function getHTMLType(componentName) {
  // Extract the component name from paths like Component.SubComponent
  const simpleName = componentName.split(".").pop();
  return COMPONENT_TO_HTML_TYPE[simpleName] || COMPONENT_TO_HTML_TYPE.default;
}

// Process a single file
function processFile(filePath) {
  console.log(`Processing ${filePath}...`);

  let content = fs.readFileSync(filePath, "utf8");
  let hasChanges = false;

  // Fix import paths
  const fixedImportContent = content.replace(
    IMPORT_PATH_REGEX,
    (match, componentName) => {
      hasChanges = true;
      return `${CORRECT_IMPORT_PATH}${componentName}`;
    }
  );

  // Fix React.ElementRef
  const fixedContent = fixedImportContent.replace(
    ELEMENT_REF_REGEX,
    (match, componentName) => {
      hasChanges = true;
      return getHTMLType(componentName);
    }
  );

  if (hasChanges) {
    fs.writeFileSync(filePath, fixedContent, "utf8");
    console.log(`✅ Fixed ${filePath}`);
    return true;
  }

  console.log(`No changes needed for ${filePath}`);
  return false;
}

// Process all files in a directory
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  let modifiedFiles = 0;

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      modifiedFiles += processDirectory(filePath);
    } else if (
      stat.isFile() &&
      (file.endsWith(".tsx") || file.endsWith(".ts"))
    ) {
      if (processFile(filePath)) {
        modifiedFiles++;
      }
    }
  });

  return modifiedFiles;
}

// Main execution
console.log("🔍 Starting global fix for Radix UI components...");
const modifiedFiles = processDirectory(UI_COMPONENTS_DIR);
console.log(`✨ Done! Modified ${modifiedFiles} files.`);
