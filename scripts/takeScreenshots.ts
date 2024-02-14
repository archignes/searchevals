const fs1 = require('fs');
const path1 = require('path');


const puppeteer = require('puppeteer');

async function captureScreenshots(urls) {
    const browser = await puppeteer.launch();
    for (const url of urls) {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.setViewport({ width: 1200, height: 630 });
        const outputPath = `src/screenshots/${url.replace(/[^a-zA-Z]/g, "_")}.png`;
        const element = await page.$('#search-eval-card-div');
        await element.screenshot({ path: outputPath });
        // await page.screenshot({ path: outputPath });
        console.log(`Screenshot taken for ${url}`);
        console.log(`   - saved at ${outputPath}`);
    }
    await browser.close();
}

const existingScreenshots = fs1.readdirSync('src/screenshots').map(file => file.replace('.png', '').replace(/_/g, '-'));
const evalsData = require('../src/data/evals.json');
const existingPages = evalsData.map(evalItem => `https://searchevals.com/card/${evalItem.id}`);

const filteredPagesForScreenshots = existingPages.filter(page => {
    const pageId = page.split('/').pop();
    return !existingScreenshots.includes(`https___searchevals_com_card_${pageId}`);
});

console.log(`Pages to capture: ${filteredPagesForScreenshots.length}`);

captureScreenshots(filteredPagesForScreenshots);
