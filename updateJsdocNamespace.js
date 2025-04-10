const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'src/app/components/modules');
const COMPONENT_DIRS = ['container', 'presentation', 'layout'];
const FILE_EXTENSIONS = ['.js', '.jsx'];

/**
 * Recursively scans the given directory for component files and updates their JSDoc.
 * @param {string} dir - The directory to scan.
 */
function updateJSDocInComponents(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
        if (entry.name.startsWith('.')) return; // Skip hidden/system files

        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (COMPONENT_DIRS.includes(entry.name)) {
                processComponentFiles(fullPath, path.basename(dir));
            } else {
                updateJSDocInComponents(fullPath);
            }
        }
    });
}

/**
 * Processes all component files inside a directory, adding/updating JSDoc comments.
 * @param {string} directory - The directory containing component files.
 * @param {string} moduleName - The module name (e.g., 'admin', 'company-page').
 */
function processComponentFiles(directory, moduleName) {
    fs.readdirSync(directory, { withFileTypes: true }).forEach(entry => {
        if (!entry.isFile() || !FILE_EXTENSIONS.includes(path.extname(entry.name))) return;

        const filePath = path.join(directory, entry.name);
        updateJSDoc(filePath, moduleName, path.basename(directory));
    });
}

/**
 * Updates or adds a JSDoc comment in a given file without replacing existing ones.
 * @param {string} filePath - The path of the file to update.
 * @param {string} moduleName - The module name (e.g., 'admin').
 * @param {string} componentType - The type of component ('container' or 'presentation').
 */
function updateJSDoc(filePath, moduleName, componentType) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath, path.extname(filePath));
        const namespace = `${moduleName}`;
        const moduleTag = `${moduleName}`;

        const jsdocRegex = /\/\*\*[\s\S]*?\*\//;

        // New JSDoc comment to add
        const newJSDoc = `/**\n * @namespace ${namespace}\n * @module ${moduleTag}\n */\n`;

        // Check if there are existing JSDoc comments
        if (jsdocRegex.test(content)) {
            // If JSDoc exists, prepend the new JSDoc without replacing it
            content = content.replace(jsdocRegex, (match) => newJSDoc + match);
        } else {
            // If no JSDoc exists, add the new JSDoc at the beginning
            content = newJSDoc + content;
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated JSDoc: ${filePath}`);
    } catch (error) {
        console.error(`❌ Error updating JSDoc in ${filePath}:`, error.message);
    }
}

// Start scanning components for JSDoc updates
updateJSDocInComponents(BASE_DIR);
