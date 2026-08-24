const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'src', 'components', 'templates');

// 1. Vantage
fs.writeFileSync(path.join(outDir, 'Vantage.tsx'), `
import Placeholder from "./Placeholder";
export default function Vantage({ isPreview }: { isPreview?: boolean }) {
  return <Placeholder _isPreview={isPreview} />;
}
`);

// 2. SecurityLayer
fs.writeFileSync(path.join(outDir, 'SecurityLayer.tsx'), `
import Placeholder from "./Placeholder";
export default function SecurityLayer({ isPreview }: { isPreview?: boolean }) {
  return <Placeholder _isPreview={isPreview} />;
}
`);

// 3. SPD
fs.writeFileSync(path.join(outDir, 'SPD.tsx'), `
import Placeholder from "./Placeholder";
export default function SPD({ isPreview }: { isPreview?: boolean }) {
  return <Placeholder _isPreview={isPreview} />;
}
`);

// 4. JWTBankCarousel
const promptsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'data', 'prompts-extra.json'), 'utf8'));
const jwtText = promptsData.jwtBankCarousel;
const codeStart = jwtText.indexOf("import React");
if (codeStart !== -1) {
    let code = jwtText.substring(codeStart);
    // Replace "export default function App" with "export default function JWTBankCarousel"
    code = code.replace("export default function App(", "export default function JWTBankCarousel({ isPreview = false }: { isPreview?: boolean }) {");
    // Also we might need to change `export default function App()`
    code = code.replace("export default function App() {", "export default function JWTBankCarousel({ isPreview = false }: { isPreview?: boolean }) {");
    
    // Write
    fs.writeFileSync(path.join(outDir, 'JWTBankCarousel.tsx'), code);
    console.log("Wrote JWTBankCarousel.tsx");
} else {
    console.error("Could not find 'import React' in jwtBankCarousel");
}

console.log("Built all 4 components.");
