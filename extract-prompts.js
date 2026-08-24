const fs = require('fs');
const readline = require('readline');

async function extractLastUserMessage() {
    const fileStream = fs.createReadStream('C:/Users/HP/.gemini/antigravity-ide/brain/434897f2-3204-4513-ac20-fe513c66e1a0/.system_generated/logs/transcript_full.jsonl');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lastUserMessage = '';

    for await (const line of rl) {
        if (!line) continue;
        try {
            const parsed = JSON.parse(line);
            if (parsed.type === 'USER_INPUT') {
                lastUserMessage = parsed.content;
            }
        } catch (e) {
            // ignore parse errors
        }
    }

    // Now split the last user message into the 4 prompts
    // The prompts are separated by specific text or we can just save the whole thing and parse it.
    // Actually, let's just save the whole message as a JSON object with one key first to inspect it,
    // or try to split it into 4.
    
    // Split by the known starting phrases:
    const p1Start = "add this as sections\"Recreate this page";
    const p2Start = "\"Build a **single self-contained `index.html`** that recreates this cybersecurity landing page";
    const p3Start = "Create a single full-page section with a solid `#FF0000`";
    const p4Start = "Create a high-performance, interactive 3D horizontal cylinder carousel";

    // Since they are somewhat merged or have quotes, let's just use substring
    const p1Idx = lastUserMessage.indexOf("Recreate this page **pixel-faithfully**");
    const p2Idx = lastUserMessage.indexOf("Build a **single self-contained `index.html`** that recreates this cybersecurity");
    const p3Idx = lastUserMessage.indexOf("Create a single full-page section with a solid `#FF0000`");
    const p4Idx = lastUserMessage.indexOf("Create a high-performance, interactive 3D horizontal cylinder carousel");

    const prompt1 = lastUserMessage.substring(p1Idx, p2Idx).replace(/^add this as sections"/, '').replace(/","$/, '').trim();
    const prompt2 = lastUserMessage.substring(p2Idx, p3Idx).replace(/","$/, '').trim();
    const prompt3 = lastUserMessage.substring(p3Idx, p4Idx).replace(/","$/, '').trim();
    const prompt4 = lastUserMessage.substring(p4Idx).replace(/"$/, '').trim();

    const output = {
        vantage: prompt1,
        securityLayer: prompt2,
        spd: prompt3,
        jwtBankCarousel: prompt4
    };

    fs.writeFileSync('d:/Prompt-Lab/src/data/prompts-extra.json', JSON.stringify(output, null, 2));
    console.log('Successfully extracted 4 prompts to prompts-extra.json');
}

extractLastUserMessage();
