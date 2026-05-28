const fs = require('fs');
const path = require('path');

const targetDirs = [
  'src/app/investor',
  'src/app/issuer',
  'src/app/signup',
  'src/app/signin',
  'src/app/forgot-password',
  'src/app/onboarding',
  'src/app/setup-profile',
  'src/components',
  'src/app/components'
];

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // We need to be careful with ordering so we don't double replace
      // Let's use a temporary token replacement strategy or just specific word boundaries
      
      content = content.replace(/\btext-\[10px\]\b/g, 'text-xs');
      content = content.replace(/\btext-\[11px\]\b/g, 'text-xs');
      content = content.replace(/\btext-\[12px\]\b/g, 'text-sm');
      content = content.replace(/\btext-\[13px\]\b/g, 'text-sm');
      
      // text-xs -> text-sm
      content = content.replace(/\btext-xs\b/g, 'text-sm');
      // text-sm -> text-base (Wait, we just replaced things WITH text-sm! If we do this, the newly text-sm things will become text-base.
      // So let's do a single pass function replacer)
      
      fs.writeFileSync(fullPath, content);
      if (content !== originalContent) {
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

// Single pass replacer to avoid double replacement
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
      
      content = content.replace(/\b(text-\[10px\]|text-\[11px\]|text-\[12px\]|text-\[13px\]|text-xs|text-sm)\b/g, (match) => {
        switch(match) {
          case 'text-[10px]': return 'text-xs';
          case 'text-[11px]': return 'text-xs';
          case 'text-[12px]': return 'text-sm';
          case 'text-[13px]': return 'text-base';
          case 'text-xs': return 'text-sm';
          case 'text-sm': return 'text-base';
          default: return match;
        }
      });
      
      fs.writeFileSync(fullPath, content);
      if (content !== originalContent) {
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

targetDirs.forEach(processDirSinglePass);
