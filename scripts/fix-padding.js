const fs = require('fs');
const path = require('path');

const IMPORT_STATEMENT = "import { MOBILE_PAGE_PADDING_BOTTOM } from '@/utils/constants'";
const PADDING_PATTERN = /paddingBottom:\s*['"`]\d+px['"`]/g;
const REPLACEMENT = "paddingBottom: `${MOBILE_PAGE_PADDING_BOTTOM}px`";

function fixPaddingInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file already has the import
    const hasImport = content.includes("from '@/utils/constants'");
    
    // Check if file has paddingBottom
    if (content.match(PADDING_PATTERN)) {
      // Replace paddingBottom values
      content = content.replace(PADDING_PATTERN, REPLACEMENT);
      
      // Add import if not present
      if (!hasImport) {
        // Find the last import statement
        const importMatches = content.match(/^import .* from .*/gm);
        if (importMatches) {
          const lastImport = importMatches[importMatches.length - 1];
          const lastImportIndex = content.lastIndexOf(lastImport);
          const insertPosition = lastImportIndex + lastImport.length;
          content = content.slice(0, insertPosition) + '\n' + IMPORT_STATEMENT + content.slice(insertPosition);
        }
      }
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${filePath}`);
      return true;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
  return false;
}

// Get all TSX files in app directory
function getAllTsxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllTsxFiles(fullPath));
    } else if (item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main execution
const appDir = path.join(__dirname, '..', 'app');
const files = getAllTsxFiles(appDir);
let fixedCount = 0;

console.log(`Found ${files.length} TSX files to check...`);

for (const file of files) {
  if (fixPaddingInFile(file)) {
    fixedCount++;
  }
}

console.log(`\nFixed ${fixedCount} files with paddingBottom issues.`);