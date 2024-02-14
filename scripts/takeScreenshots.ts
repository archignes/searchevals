const fs1 = require('fs');
const path1 = require('path');
const puppeteer = require('puppeteer');
const sharp = require('sharp');

const screenshotDir = "public/screenshots/"

function getScreenshotOutputPath(url) {
    const root = "https://searchevals.com/"
    const url_trimmed = url.replace(root, "")
    const outputPath = `${screenshotDir}${url_trimmed.replace(/[^a-zA-Z\-]/g, "-")}.png`;
    return outputPath
}

async function captureScreenshots(urls) {
    const browser = await puppeteer.launch();
    for (const url of urls) {
        const outputPath = getScreenshotOutputPath(url);
        const outputPathCropped = outputPath.replace('.png', '_crop.png');

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.setViewport({ width: 1200, height: 630 });

        const element = await page.$('#search-eval-card-div');
        await element.screenshot({ path: outputPath });

        // Resize and add whitespace to maintain aspect ratio
        sharp(outputPath)
            .resize(1200, 630, {
                fit: 'cover',
                position: 'top',
            })
            .toFile(outputPathCropped)
            .then(() => {
                console.log(`Resized screenshot:\n  - url: ${url}\n  - file: ${outputPathCropped}`);
            })
            .catch(err => console.error("Error resizing image:", err));
    }
    await browser.close();
}

const existingScreenshots = fs1.readdirSync(screenshotDir).map(file => file.replace('.png', '').replace(/_/g, '-'));
const evalsData = require('../src/data/evals.json');
const existingPages = evalsData.map(evalItem => `https://searchevals.com/card/${evalItem.id}`);

const filteredPagesForScreenshots = existingPages.filter(page => {
    const pageId = page.split('/').pop();
    return !existingScreenshots.includes(`card-${pageId}`);
});

console.log(`Pages to capture: ${filteredPagesForScreenshots.length}`);

captureScreenshots(filteredPagesForScreenshots);
