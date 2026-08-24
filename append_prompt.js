const fs = require('fs');
const prompt = fs.readFileSync('apogee_prompt.txt', 'utf8');
const exportString = `\nexport const promptApogee = \`${prompt.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;\n`;
fs.appendFileSync('src/data/prompts.ts', exportString);
console.log('Appended promptApogee');
