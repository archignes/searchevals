const fs1 = require('fs');
const path1 = require('path');
const puppeteer = require('puppeteer');
const sharp = require('sharp');
const Jimp = require('jimp');

const screenshotDir = "src/screenshots/"
const publicScreenshotDir = "public/screenshots/"
const searchevals_logo = "public/og_logo.png";


function getScreenshotOutputPath(url) {
    const root = "https://searchevals.com/"
    const url_trimmed = url.replace(root, "")
    const outputPath = `${screenshotDir}${url_trimmed.replace(/[^a-zA-Z0-9\-]/g, "-")}.png`;
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

        // Remove the element with the ID 'element-to-remove'
        await page.evaluate(() => {
            const element = document.getElementById('search-on-eval-button');
            if (element) {
                if (element.parentNode)
                    {element.parentNode.removeChild(element);
                }
            }
        });

        const element = await page.$('#search-eval-card-div');
        if (element) {
            await element.screenshot({ path: outputPath });

            // Resize and add whitespace to maintain aspect ratio
            await sharp(outputPath)
                .resize(1200, 630, {
                    fit: 'cover',
                    position: 'top',
                })
                .toFile(outputPathCropped)
                .then(() => {
                    console.log(`Resized screenshot:\n  - url: ${url}\n  - file: ${outputPathCropped}`);
                })
                .catch(err => console.error("Error resizing image:", err));
            addLogoToImage(outputPathCropped, searchevals_logo)
        } else {
            console.error(`Could not find the element '#search-eval-card-div' on the page: ${url}`);
        }
    }
    await browser.close();
}

// Function to add the logo to the top right corner of the image
const addLogoToImage = async (original_image, searchevals_logo) => {
    // Read the original image and the logo
    const [image, logo] = await Promise.all([
        Jimp.read(original_image),
        Jimp.read(searchevals_logo)
    ]);

    // Resize the logo if needed (optional)
    // logo.resize(300, Jimp.AUTO); // Example resize to a width of 200 pixels
    
    // Calculate the position for the logo in the top right corner
    const xPosition = image.bitmap.width - logo.bitmap.width;
    const yPosition = 0; // Top of the image

    // Composite the logo onto the image
    image.composite(logo, xPosition, yPosition, {
        mode: Jimp.BLEND_SOURCE_OVER, // Use BLEND_SOURCE_OVER for transparency
        opacitySource: 1.0 // Opacity level of the logo
    });

    // Save the result
    const publicOutputPath = original_image.replace("_crop", "").replace(screenshotDir, publicScreenshotDir)
    image.write(publicOutputPath)
    console.log(`  - added logo: ${publicOutputPath}`)

};

const existingOgScreenshots = fs1.readdirSync(publicScreenshotDir).map(file => file.replace('.png', '').replace(/_/g, '-'));
const evalsData = require('../src/data/evals.json');
const existingPages = evalsData.map(evalItem => `https://searchevals.com/card/${evalItem.id}`);

const filteredPagesForScreenshots = existingPages.filter(page => {
    const pageId = page.split('/').pop();
    return !existingOgScreenshots.includes(`card-${pageId}`);
});

console.log(`Pages to capture: ${filteredPagesForScreenshots.length}`);

captureScreenshots(filteredPagesForScreenshots);