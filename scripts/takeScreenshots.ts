/**
 * This script automates the process of capturing and processing screenshots for various web pages.
 * It uses Puppeteer to navigate to each page, captures screenshots, and optionally crops and resizes them.
 * Additionally, it can remove specified elements from the page before taking a screenshot and overlays a logo onto the final image.
 * The script is designed to handle both individual card pages and the homepage, with special processing rules for each.
 * It checks existing screenshots to avoid redundant captures and uses a local server for page rendering.
 */
const fs1 = require('fs');
const path1 = require('path');
const puppeteer = require('puppeteer');
const sharp = require('sharp');
const Jimp = require('jimp');

// Polyfill for CSS.escape
function cssEscape(value) {
    return String(value).replace(/[^a-zA-Z0-9\-_]/g, (s) => {
        const c = s.charCodeAt(0);
        if (c === 0x20) return '\\ ';
        if (c >= 0x30 && c <= 0x39) return '\\3' + c.toString(16) + ' ';
        if (c >= 0x41 && c <= 0x5a) return s;
        if (c >= 0x61 && c <= 0x7a) return s;
        return '\\' + c.toString(16) + ' ';
    });
}

const port = 3000;
const baseUrl = `http://localhost:${port}/`;

const screenshotDir = "src/screenshots/";
const publicScreenshotDir = "public/screenshots/";
const searchevals_logo = "public/og_logo_wide.png";

function getScreenshotOutputPath(url, baseUrl) {
    if (url === baseUrl) {
        return `${publicScreenshotDir}home.png`;
    }
    const url_trimmed = url.replace(baseUrl, "");
    // Construct the output path for the screenshot by replacing any characters
    // that are not alphanumeric or hyphens or underscores with a hyphen. This ensures the file
    // name is valid and does not contain any special characters.
    const outputPath = `${screenshotDir}${url_trimmed.replace(/[^a-zA-Z0-9\-_]/g, "-")}.png`;
    return outputPath;
}

async function captureScreenshots(urls, baseUrl, port) {
    const browser = await puppeteer.launch();
    for (const url of urls) {
        const outputPath = getScreenshotOutputPath(url, baseUrl);
        const outputPathCropped = outputPath.replace('.png', '_crop.png');

        const page = await browser.newPage();
        await page.goto(`${url}`, { waitUntil: 'networkidle2' });
        await page.setViewport({ width: 1200, height: 630 });

        if (outputPath.endsWith('home.png')) {
            await page.screenshot({ path: outputPath });
            console.log(`  - url: ${url}\n  - file: ${outputPath}`);
        } else {
            await captureCardScreenshot(url, page, outputPath, outputPathCropped);
            await addLogoToImage(outputPathCropped || outputPath, searchevals_logo);
        }
    }
    await browser.close();
}

const captureCardScreenshot = async (url, page, outputPath, outputPathCropped) => {
    // Remove the element with the ID 'element-to-remove'
    await page.evaluate(() => {
        const element = document.getElementById('search-on-eval-button');
        if (element) {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }
    });
    const evalId = url.split('card/')[1];
    console.log(`  - evalId: ${evalId}`);

    // Escape special characters in the evalId
    const escapedEvalId = cssEscape(`search-eval-card-${evalId}`);
    console.log(`  - Escaped evalId: ${escapedEvalId}`);

    const element = await page.$(`#${escapedEvalId}`);
    if (element) {
        await element.screenshot({ path: outputPath });
    } else {
        console.error(`Could not find the element '#${escapedEvalId}' on the page: ${url}`);
    }

    await extractResize(url, outputPath, outputPathCropped);
};

const extractResize = async (url, outputPath, outputPathCropped) => {
    try {
        await sharp(outputPath)
            .metadata()
            .then(({ width, height }) => {
                // Ensure the image is large enough to be cropped and resized as desired
                return sharp(outputPath)
                    .extract({ left: 1, top: 1, width: width - 2, height: height - 2 }) // Adjust based on the actual border size
                    .resize(1200, 630, {
                        fit: 'cover',
                        position: 'top',
                    })
                    .toFile(outputPathCropped);
            })
            .then(() => {
                console.log(`Cropped and resized screenshot:\n  - url: ${url}\n  - file: ${outputPathCropped}`);
            });
    } catch (err) {
        console.error("Error in cropping and resizing image:", err);
    }
};

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
    const publicOutputPath = original_image.replace("_crop", "").replace(screenshotDir, publicScreenshotDir);
    image.write(publicOutputPath);
    console.log(`  - added logo: ${publicOutputPath}`);
};

// Read the list of existing screenshots from the public directory and remove the file extension
const existingOgScreenshots = fs1.readdirSync(publicScreenshotDir).map(file => file.replace('.png', ''));

// Load evaluation data from a JSON file
const evalsData = require('../src/data/evals.json');

// Create a list of existing pages based on the evaluation data
const existingPages = evalsData.map(evalItem => `${baseUrl}card/${evalItem.id}`);

// Filter out pages that already have screenshots
const filteredPagesForScreenshots = existingPages.filter(page => {
    const pageId = page.split('/').pop(); // Extract the page ID from the URL
    return !existingOgScreenshots.includes(`card-${pageId}`); // Check if the screenshot already exists
});
console.log(`Pages to capture: ${filteredPagesForScreenshots.length + 1}`);

captureScreenshots(filteredPagesForScreenshots, baseUrl, port);

console.log(' - Capturing homepage...');
captureScreenshots([baseUrl], baseUrl, port);
