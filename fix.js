const fs = require('fs');
const text = fs.readFileSync('insert_templates.js', 'utf8');
const p1 = text.match(/const prompt1 = `([\s\S]*?)`;\s*const prompt2/)[1];
const p2 = text.match(/const prompt2 = `([\s\S]*?)`;\s*const prompt3/)[1];
const p3 = text.match(/const prompt3 = `([\s\S]*?)`;\s*const prompt4/)[1];
const p4 = text.match(/const prompt4 = `([\s\S]*?)`;\s*async function run/)[1];

const out = 'export const promptPrmptArchive = `' + p1 + '`;\n\n' +
            'export const promptMarketeam = `' + p2 + '`;\n\n' +
            'export const promptViktorStudio = `' + p3 + '`;\n\n' +
            'export const promptOrbitSecureSystem = `' + p4 + '`;\n';

fs.writeFileSync('src/data/prompts.ts', out);
console.log('Fixed prompts.ts');
