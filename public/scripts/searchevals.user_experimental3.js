// ==UserScript==
// @name         3 Twitter Search Eval Data Extractor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extracts data from Twitter and formats it into JSON for searchevals.com
// @author       Your Name
// @match        https://twitter.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

// These next two lines are needed to skip the linting errors
/* global GM_setClipboard */
/* global GM_xmlhttpRequest */
/* global GM_addStyle */
/* global jQuery */


(function () {

    // API endpoint for retrieving systems options
    const API_URL = 'https://example.com/api/systems';

    // Create floating button
    const floatingButton = jQuery('<button>', {
        text: 'Open Search Eval Interface',
        css: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999,
            padding: '10px',
            backgroundColor: '#1DA1F2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
        },
        click: openInterface
    }).appendTo('body');

    // Create interface container
    const interfaceContainer = jQuery('<div>', {
        id: 'evalExtractorForm',
        css: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            display: 'none',
            width: '400px',
            maxHeight: '80vh',
            overflowY: 'auto'
        }
    }).appendTo('body');

    // Add custom styles
    GM_addStyle(`
        #evalExtractorForm h2 {
            font-size: 18px;
            margin-top: 0;
        }

        #evalExtractorForm div {
            margin-bottom: 15px;
        }

        #evalExtractorForm label {
            display: block;
            font-size: 16px;
        }

        #evalExtractorForm input,
        #evalExtractorForm select,
        #evalExtractorForm textarea {
            width: 100%;
            font-size: 14px;
            padding: 8px;
        }

        #evalExtractorForm button {
            margin-right: 10px;
        }
    `);

    
    // Create form elements
    const evaluatorIdInput = jQuery('<input>', { type: 'text', placeholder: 'Evaluator ID', readonly: true });
    const evaluatorNameInput = jQuery('<input>', { type: 'text', placeholder: 'Evaluator Name' });
    const evaluatorRoleInput = jQuery('<input>', { type: 'text', placeholder: 'Evaluator Role' });
    const evaluatorConflictsInput = jQuery('<input>', { type: 'text', placeholder: 'Conflicts (optional)' });
    const evaluatorUrlInput = jQuery('<input>', { type: 'text', placeholder: 'Evaluator URL', readonly: true });

    const evalIdInput = jQuery('<input>', { type: 'text', placeholder: 'Eval ID' });
    const evalDateInput = jQuery('<input>', { type: 'date', placeholder: 'Eval Date' });
    const evalQueryInput = jQuery('<input>', { type: 'text', placeholder: 'Query' });
    const evalUrlInput = jQuery('<input>', { type: 'text', placeholder: 'Eval URL', readonly: true });
    const evalKeyPhrasesInput = jQuery('<input>', { type: 'text', placeholder: 'Key Phrases (optional)' });
    const evalContextInput = jQuery('<textarea>', { placeholder: 'Context (optional)' });
    const evalSystemsSelect = jQuery('<select>', { multiple: true });
    const evalContentInput = jQuery('<textarea>', { placeholder: 'Content', readonly: true });
    const evalImagesInput = jQuery('<input>', { type: 'checkbox', id: 'evalImagesCheckbox' });
    const evalImagesLabel = jQuery('<label>', { for: 'evalImagesCheckbox', text: 'Images Annotated' });

    const generateEvaluatorJsonButton = jQuery('<button>', { text: 'Generate Evaluator JSON', click: generateEvaluatorJson });
    const generateEvalJsonButton = jQuery('<button>', { text: 'Generate Eval JSON', click: generateEvalJson });
    const closeButton = jQuery('<button>', { text: 'Close', click: closeInterface });
    const collapseButton = jQuery('<button>', { text: 'Collapse', click: collapseInterface });

    // Append form elements to the interface container
    interfaceContainer.append(
        jQuery('<h2>', { text: 'Evaluator' }),
        evaluatorIdInput,
        evaluatorNameInput,
        evaluatorRoleInput,
        evaluatorConflictsInput,
        evaluatorUrlInput,
        generateEvaluatorJsonButton,
        jQuery('<h2>', { text: 'Eval' }),
        evalIdInput,
        evalDateInput,
        evalQueryInput,
        evalUrlInput,
        evalKeyPhrasesInput,
        evalContextInput,
        evalSystemsSelect,
        evalContentInput,
        evalImagesInput,
        evalImagesLabel,
        generateEvalJsonButton,
        closeButton,
        collapseButton
    );

    // Function to open the interface
    function openInterface() {
        interfaceContainer.show();
        populateEvaluatorFields();
        populateEvalFields();
        fetchSystemsOptions();
    }

    // Function to populate evaluator fields
    function populateEvaluatorFields() {
        const userId = extractUserIdFromUrl();
        const userUrl = window.location.href;

        evaluatorIdInput.val(userId);
        evaluatorUrlInput.val(userUrl);
    }

    // Function to populate eval fields
    function populateEvalFields() {
        const tweetContent = extractTweetContent();
        const tweetUrl = window.location.href;

        evalUrlInput.val(tweetUrl);
        evalContentInput.val(tweetContent);
    }

    // Function to fetch systems options from the API
    function fetchSystemsOptions() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: API_URL,
            onload: function (response) {
                const systems = JSON.parse(response.responseText);
                systems.forEach(function (system) {
                    evalSystemsSelect.append(jQuery('<option>', { text: system }));
                });
            }
        });
    }

    // Function to generate evaluator JSON
    function generateEvaluatorJson() {
        const evaluatorData = {
            id: evaluatorIdInput.val(),
            name: evaluatorNameInput.val(),
            role: evaluatorRoleInput.val(),
            conflicts: evaluatorConflictsInput.val(),
            url: evaluatorUrlInput.val()
        };

        if (validateEvaluatorData(evaluatorData)) {
            const evaluatorJson = JSON.stringify(evaluatorData, null, 2);
            GM_setClipboard(evaluatorJson);
            alert('Evaluator JSON copied to clipboard!');
        } else {
            alert('Please fill in all required evaluator fields.');
        }
    }

    // Function to generate eval JSON
    function generateEvalJson() {
        const evalData = {
            id: evalIdInput.val(),
            date: evalDateInput.val(),
            query: evalQueryInput.val(),
            url: evalUrlInput.val(),
            keyPhrases: evalKeyPhrasesInput.val(),
            context: evalContextInput.val(),
            systems: Array.from(evalSystemsSelect.find('option:selected')).map(function (option) {
                return option.value;
            }),
            content: evalContentInput.val(),
            images: evalImagesInput.is(':checked'),
            evaluatorId: evaluatorIdInput.val()
        };

        if (validateEvalData(evalData)) {
            const evalJson = JSON.stringify(evalData, null, 2);
            GM_setClipboard(evalJson);
            alert('Eval JSON copied to clipboard!');
        } else {
            alert('Please fill in all required eval fields.');
        }
    }

    // Function to validate evaluator data
    function validateEvaluatorData(evaluatorData) {
        return evaluatorData.id && evaluatorData.name && evaluatorData.role && evaluatorData.url;
    }

    // Function to validate eval data
    function validateEvalData(evalData) {
        return evalData.id && evalData.date && evalData.query && evalData.url && evalData.content && evalData.evaluatorId;
    }

    // Function to extract user ID from the URL
    function extractUserIdFromUrl() {
        const url = window.location.href;
        const regex = /twitter\.com\/(\w+)/;
        const match = url.match(regex);
        return match ? match[1] : '';
    }

    // Function to extract tweet content
    function extractTweetContent() {
        const tweetElement = document.querySelector('article[data-testid="tweet"]');
        return tweetElement ? tweetElement.innerText : '';
    }

    // Function to close the interface
    function closeInterface() {
        interfaceContainer.hide();
    }

    // Function to collapse the interface (you can customize this based on your specific requirements)
    function collapseInterface() {
        interfaceContainer.css({
            height: '30px',
            overflow: 'hidden'
        });
        floatingButton.text('Expand Search Eval Interface');
    }
})();