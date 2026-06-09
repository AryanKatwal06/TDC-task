const fs = require('fs');
const path = require('path');

const md = fs.readFileSync(process.argv[2] || 'TDC_Phase1_FINAL.md', 'utf8');
const lines = md.split('\n');

let currentFile = null;
let currentContent = [];
let insideCodeBlock = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if ((line.startsWith('## ') || line.startsWith('### ')) && !insideCodeBlock) {
    const maybeFile = line.replace(/^#+\s+/, '').trim();
    // check if it looks like a file path
    if (maybeFile.includes('.')) {
      currentFile = maybeFile;
      currentContent = [];
    } else {
      currentFile = null;
    }
  } else if (line.startsWith('```') && currentFile) {
    if (!insideCodeBlock) {
      insideCodeBlock = true;
    } else {
      insideCodeBlock = false;
      
      // We finished a code block, let's write it
      const filePath = path.join(__dirname, currentFile);
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, currentContent.join('\n'));
      console.log('Wrote', filePath);
      
      currentFile = null;
      currentContent = [];
    }
  } else if (insideCodeBlock) {
    currentContent.push(line);
  }
}
