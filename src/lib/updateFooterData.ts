const fs = require('fs');
const path = require('path');

const footerPath = path.join(__dirname, 'src/components/Footer.tsx');
const fileContents = fs.readFileSync(footerPath, 'utf8');

const updatedContents = fileContents.replace(
    /<span id="last-updated-placeholder">.*?<\/span>/,
    `<span id="last-updated-placeholder">${new Date().toISOString()} UTC</span>`
);

fs.writeFileSync(footerPath, updatedContents);