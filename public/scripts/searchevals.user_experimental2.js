// ==UserScript==
// @name         Enhanced Twitter Search Eval Data Extractor
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Extracts eval data from Twitter for searchevals.com input
// @author       Your Enhanced Version
// @match        https://twitter.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// ==/UserScript==

// These next two lines are needed to skip the linting errors
/* global GM_setClipboard */
/* global GM_xmlhttpRequest */

(async function () {
    'use strict';

    const API_URL = "https://xbq1s7ts13.execute-api.us-east-1.amazonaws.com/beta/?action=systems";

    // Create and style floating button
    const button = document.createElement('button');
    button.textContent = 'Extract Eval Data';
    Object.assign(button.style, {
        position: 'fixed', bottom: '20px', right: '20px',
        zIndex: '9999', padding: '10px', backgroundColor: '#1DA1F2',
        color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer',
    });
    document.body.appendChild(button);

    // Modal-like interface for data extraction
    let form = createForm(); // Assuming createForm is a function that creates the form and returns the element
    document.body.appendChild(form);

    button.onclick = () => form.style.display = 'block';

    // Populate systems options dynamically
    try {
        const systems = await fetchSystems(API_URL); // Assuming fetchSystems is an async function that fetches systems and returns them
        populateSystemsOptions(systems); // Assuming populateSystemsOptions is a function that adds systems as options to the select element
    } catch (error) {
        console.error('Failed to fetch systems:', error);
    }

    // Extracting current page data and populating the form
    function populateFormWithCurrentPageData() {
        // Implementation depends on Twitter's DOM structure; pseudocode provided
        const tweetDetails = extractCurrentTweetDetails(); // Assuming this function extracts necessary details from the tweet
        fillFormWithData(tweetDetails); // Assuming this function fills the form with extracted tweet details
    }

    // Listen for changes in the URL or page content to update form data accordingly
    new MutationObserver(() => {
        populateFormWithCurrentPageData();
    }).observe(document, { subtree: true, childList: true });

    // Generating and copying JSON to clipboard with error handling
    document.getElementById('generateEvaluatorJson').onclick = generateAndCopyEvaluatorJson; // Assuming this function generates evaluator JSON and copies it to the clipboard
    document.getElementById('generateEvalJson').onclick = generateAndCopyEvalJson; // Assuming this function generates eval JSON and copies it to the clipboard

    function generateAndCopyEvaluatorJson() {
        try {
            const evaluatorJson = {}; // Collect data from form and format as JSON
            GM_setClipboard(JSON.stringify(evaluatorJson));
            alert('Evaluator JSON copied to clipboard!');
        } catch (error) {
            alert('Failed to generate evaluator JSON: ' + error.message);
        }
    }

    function generateAndCopyEvalJson() {
        try {
            const evalData = collectEvalDataFromForm(); // Assuming this function collects eval data from the form
            const evalJson = JSON.stringify(evalData, null, 2);
            GM_setClipboard(evalJson);
            alert('Eval JSON copied to clipboard!');
        } catch (error) {
            alert('Failed to generate eval JSON: ' + error.message);
        }
    }

    // Utility functions
    async function fetchSystems(apiUrl) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                onload: function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject(new Error('Fetching systems failed: ' + response.statusText));
                    }
                },
                onerror: function (error) {
                    reject(new Error('Network error: ' + error.statusText));
                }
            });
        });
    }


    function populateSystemsOptions(systems) {
        const select = document.getElementById('evalSystemsSelect'); // Assuming this is the ID for the systems select element
        systems.forEach(system => {
            const option = document.createElement('option');
            option.value = system.id;
            option.textContent = system.name;
            select.appendChild(option);
        });
    }

    function collectEvalDataFromForm() {
        // Here, you would collect all the necessary data from the form elements
        // This is a simplified example
        return {
            // Collect values from form fields, e.g.,
            id: document.getElementById('evalIdInput').value,
            date: document.getElementById('evalDateInput').value,
            // And so on for other fields
        };
    }

    function extractCurrentTweetDetails() {
        // This would involve selecting the tweet elements from the page and extracting their data
        // Due to Twitter's dynamic content loading, consider using event delegation or observing for mutations to determine the correct tweet
        return {
            // Extracted data placeholders
            content: '', // e.g., document.querySelector('[data-testid="tweetText"]').textContent,
            url: window.location.href,
            // Other necessary details
        };
    }

    function fillFormWithData(tweetDetails) {
        // Fill the form with data extracted from the current tweet
        document.getElementById('evalContentInput').value = tweetDetails.content;
        document.getElementById('evalUrlInput').value = tweetDetails.url;
        // And so on for other fields
    }

    // Assuming createForm is a function that builds and returns the form element, setting IDs for input elements as used above
    function createForm() {
        // The form creation code here would be similar to the original script, 
        // but with improvements for modularity and maintainability.
        const formElement = document.createElement('div');
        // Set up formElement with all necessary inputs and buttons, assigning IDs as used in the functions above
        return formElement;
    }

    // Call this function to initially populate the form with data from the current page
    populateFormWithCurrentPageData();
})();