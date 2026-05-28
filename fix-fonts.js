const fs = require('fs');
const path = require('path');

function processDirSinglePass(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirSinglePass(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      const regex = /(?<=^|[\s"'\`])(text-\[10px\]|text-\[11px\]|text-\[12px\]|text-\[13px\]|text-\[14px\]|text-xs|text-sm)(?=[\s"'\`]|$)/g;
      
      content = content.replace(regex, (match) => {
        switch(match) {
          case 'text-[10px]': return 'text-xs';
          case 'text-[11px]': return 'text-xs';
          case 'text-[12px]': return 'text-sm';
          case 'text-[13px]': return 'text-base';
          case 'text-[14px]': return 'text-base';
          case 'text-xs': return 'text-sm';
          case 'text-sm': return 'text-base';
          default: return match;
        }
      });
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirSinglePass('src');
