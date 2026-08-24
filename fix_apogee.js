const fs = require('fs');
let content = fs.readFileSync('src/components/templates/Apogee.tsx', 'utf8');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');
fs.writeFileSync('src/components/templates/Apogee.tsx', content);
