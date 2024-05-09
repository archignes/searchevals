// ==UserScript==
// @name         searchevals.extract-experimental
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extract data from a tweet link for input into searchevals.com/input
// @author       searchevals.com
// @match        https://twitter.com/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// ==/UserScript==

// Goal: extract json formatted data objects from links, objects include Evaluators and Evals
//
// TODO:
//  - Add a field for the systems and let the user select multiple (pulled from the api)
//  - Add a checkbox to indicate when images are annotated.
//  - Ensure the image list is included in the json output.



// Supported websites:
//  - Twitter.com
// Evaluators:
// {
//     id: string;
//     name: string;
//     role: string;
//     conflict?: string[];
//     URL: string;
// }
// Evals:
// {
//     id: string;
//     date: string;
//     query: string;
//     url: string;
//     key_phrases?: string[];
//     context?: string;
//     systems: string[];
//     eval_parts?: evalPart[];
//     content?: string;
//     images?: imageItem[];
//     evaluator_id: string;
// }

// These next two lines are needed to skip the linting errors
/* global GM_setClipboard */
/* global GM_xmlhttpRequest */


(function () {

    // Add CSS to the head of the document
    const style = document.createElement('style');
    style.innerHTML = `
        #searchevals-form label, #searchevals-form input, #searchevals-form textarea {
            display: block;
            margin-bottom: 3px;
        }
        .input-container {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
        }
        .input-container input, .input-container textarea {
            flex-grow: 1;
            margin-right: 5px;
        }
        .input-container svg {
            flex-shrink: 0; /* Prevent the icon from shrinking */
        }
        input[readonly] {
            background-color: #f0f0f0; /* Set the background color to light grey */
        }
        #evaluator-profile {
            width: 100%;
            height: 150px;
            resize: both;
            overflow-wrap: break-word;
            word-wrap: break-word;
            border: 2px solid #718096; /* Add a border to the profile textarea */
            border-radius: 8px; /* Round the corners of the profile textarea */
            padding: 10px; /* Add padding inside the profile textarea */
            text-align: left; /* Align text to the left */
            vertical-align: top; /* Start text at the top of the input field */
        }
    `;
    document.head.appendChild(style);

    // Icons
    function createLockIconSVG() {
        return `
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 4.63601C5 3.76031 5.24219 3.1054 5.64323 2.67357C6.03934 2.24705 6.64582 1.9783 7.5014 1.9783C8.35745 1.9783 8.96306 2.24652 9.35823 2.67208C9.75838 3.10299 10 3.75708 10 4.63325V5.99999H5V4.63601ZM4 5.99999V4.63601C4 3.58148 4.29339 2.65754 4.91049 1.99307C5.53252 1.32329 6.42675 0.978302 7.5014 0.978302C8.57583 0.978302 9.46952 1.32233 10.091 1.99162C10.7076 2.65557 11 3.57896 11 4.63325V5.99999H12C12.5523 5.99999 13 6.44771 13 6.99999V13C13 13.5523 12.5523 14 12 14H3C2.44772 14 2 13.5523 2 13V6.99999C2 6.44771 2.44772 5.99999 3 5.99999H4ZM3 6.99999H12V13H3V6.99999Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
    `;
    }
    function addLockIconToElement(element) {
        const lockIconContainer = document.createElement('span'); // Create a container for the SVG
        lockIconContainer.innerHTML = createLockIconSVG(); // Set the SVG code as the container's HTML
        element.appendChild(lockIconContainer); // Append the container to the desired element
    }

    initializeUI();

    function initializeUI() {
        createFloatingButton();
    }

    function createFloatingButton() {
        const SearchevalTitle = document.createElement('span');
        SearchevalTitle.style.fontWeight = "bold";
        SearchevalTitle.innerHTML = "Search<span style='color: #718096;'>evals</span>.extract";

        // Example JavaScript to create a floating button
        const floatingButton = document.createElement('button');
        floatingButton.appendChild(SearchevalTitle);
        floatingButton.setAttribute("aria-label", "Extract tweet information for searchevals");
        floatingButton.setAttribute("title", "Extract tweet information for searchevals");
        floatingButton.style.position = 'fixed';
        floatingButton.style.top = '0';
        floatingButton.style.right = '50%';
        floatingButton.style.zIndex = '1000';
        floatingButton.style.borderTop = 'none'; // Added line to remove top border
        floatingButton.style.borderRadius = '0 0 5px 5px'; // Added line to set rounded border on the br and bl
        floatingButton.style.backgroundColor = '#ACE1AF'; // Added line to set background color to green
        floatingButton.addEventListener('click', showExtractionForms);

        document.body.appendChild(floatingButton);
    }

    function showExtractionForms() {
        const formContainer = createFormContainer();
        const gridContainer = document.createElement('div');
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = '1fr 1fr';
        gridContainer.style.gridTemplateRows = 'auto';
        gridContainer.style.gap = '20px';

        const evaluatorFormContainer = createSectionContainer('Evaluator Details');
        evaluatorFormContainer.style.gridColumn = '1 / 2';
        evaluatorFormContainer.style.gridRow = '1';

        const dataContainer = createSectionContainer('Data');
        dataContainer.style.gridColumn = '2 / 3';
        dataContainer.style.gridRow = '1';
        dataContainer.style.backgroundColor = '#f0f0f0'; // Set background color to light gray
        dataContainer.style.borderRadius = '10px'; // Set border radius to make it rounded
        dataContainer.style.padding = '10px'; // Add padding

        const evalsFormContainer = createSectionContainer('Eval Details');
        evalsFormContainer.style.gridColumn = '1 / 3';
        evalsFormContainer.style.gridRow = '2';

        gridContainer.appendChild(evaluatorFormContainer);
        gridContainer.appendChild(dataContainer);
        gridContainer.appendChild(evalsFormContainer);

        addForm(evaluatorFormContainer, getEvaluatorFields(), 'Generate Evaluator JSON');
        addForm(dataContainer, getDataFields(), null);
        addForm(evalsFormContainer, getEvalFields(), 'Generate Eval JSON');

        formContainer.appendChild(gridContainer);
        formContainer.appendChild(createCollapseButton());
        formContainer.appendChild(createCloseButton());
        document.body.appendChild(formContainer);
        autofillDetails();
    }

    function createFormContainer() {
        const existingForm = document.getElementById('searchevals-form');
        if (existingForm) existingForm.remove();

        const formContainer = document.createElement('div');
        formContainer.id = 'searchevals-form';

        // Create a header container for the title and buttons
        const formHeader = document.createElement('div');
        formHeader.style.display = 'flex';
        formHeader.style.justifyContent = 'space-between';
        formHeader.style.alignItems = 'center';

        const formTitle = document.createElement('h1');
        formTitle.innerHTML = "Search<span style='color: #718096;'>evals</span> form";
        formTitle.id = "form-title";
        formTitle.style.flexGrow = '1'; // Allow the title to take up available space

        // Append title to the header
        formHeader.appendChild(formTitle);

        // Append header to the form container before other elements
        formContainer.appendChild(formHeader);

        formContainer.style.position = 'fixed';
        formContainer.style.top = '10%';
        formContainer.style.left = '50%';
        formContainer.style.transform = 'translate(-50%, -10%)';
        formContainer.style.backgroundColor = '#fff';
        formContainer.style.border = '1px solid #ccc';
        formContainer.style.padding = '20px';
        formContainer.style.zIndex = '10000';
        formContainer.style.width = '80%';
        formContainer.style.maxWidth = '600px';
        formContainer.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        formContainer.style.overflow = 'auto';
        formContainer.style.maxHeight = '80vh';

        // Append the collapse and close buttons to the formHeader instead of formContainer directly
        formHeader.appendChild(createCollapseButton());
        formHeader.appendChild(createCloseButton());

        return formContainer;
    }
    
    function createSectionContainer(titleText) {
        const container = document.createElement('div');

        const title = document.createElement('h2');
        title.textContent = titleText;
        container.appendChild(title);
        return container;
    }

    function addForm(container, fields, buttonText) {
        fields.forEach(field => {
            const label = document.createElement('label');
            label.htmlFor = field.id;
            label.textContent = field.label;
            container.appendChild(label);

            const inputContainer = document.createElement('div');
            inputContainer.className = 'input-container';

            let input;
            if (field.type === 'select-multiple') {
                input = document.createElement('select');
                input.id = field.id;
                input.setAttribute('multiple', 'true');
            } else if (field.type === 'p') {
                input = document.createElement('p');
            } else {
                input = document.createElement('input');
                input.type = field.type;
            }
            input.id = field.id;
            input.name = field.id;
            if (field.readonly) {
                input.readOnly = true;
                input.value = field.value;
            }

            inputContainer.appendChild(input);
            if (field.readonly) {
                addLockIconToElement(inputContainer);
            }

            container.appendChild(inputContainer);
        });

        if (buttonText !== null) {
            const generateJsonButton = createGenerateJsonButton(buttonText);
            container.appendChild(generateJsonButton);
        }
    }

    function createGenerateJsonButton(buttonText) {
        const button = document.createElement('button');
        button.type = 'button';
        button.id = buttonText.toLowerCase().replace(/\s+/g, '-') + "-button";
        button.textContent = buttonText;
        button.addEventListener('click', function(event) {
            generateAndCopyJSON(event.target.id);
        });
        return button;
    }

    function getDataFields() {
        return [
            { id: 'evaluator-profile', label: 'Profile text:', type: 'p' },
            { id: 'evaluator-name-readonly', label: 'Name text:', type: 'text', readonly: true },
        ];
    }


    function getEvaluatorFields() {
        return [
            { id: 'evaluator-id', label: 'ID (Username):', type: 'text', readonly: true },
            { id: 'evaluator-name', label: 'Name:', type: 'text' },
            { id: 'evaluator-role', label: 'Role:', type: 'text' },
            { id: 'evaluator-url', label: 'URL:', type: 'text', value: window.location.href, readonly: true }
            // Add other fields as necessary
        ];
    }

    function getEvalFields() {
        const systemsField = {
            id: 'systems',
            label: 'Systems:',
            type: 'select-multiple',
            options: [] // Initialize an empty array for options
        };

        // Fetch systems and populate the field
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://xbq1s7ts13.execute-api.us-east-1.amazonaws.com/beta/?action=systems",
            onload: function (response) {
                if (response.status === 200) {
                    try {
                        let systems = JSON.parse(response.responseText);
                        if (typeof systems === 'object' && !Array.isArray(systems)) {
                            systems = Object.keys(systems).map(key => ({
                                id: key,
                                name: systems[key]
                            }));
                        }
                        if (Array.isArray(systems)) {
                            systemsField.options = systems; // Assign the fetched systems to the options array
                            const selectElement = document.getElementById('systems');
                            if (selectElement) {
                                // Clear any existing options
                                selectElement.innerHTML = '';
                                // Add new options based on the fetched systems
                                systems.forEach(system => {
                                    const option = document.createElement('option');
                                    option.value = system.id;
                                    option.textContent = system.name;
                                    selectElement.appendChild(option);
                                });
                            }
                        } else {
                            console.error('Expected an array for systems, but got:', systems);
                        }
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                    }
                } else {
                    console.error('Request failed with status:', response.status);
                }
            }
        });

        return [
            systemsField,
            { id: 'eval-content', label: 'Eval content:', type: 'textarea' },
            { id: 'eval-date', label: 'Eval date:', type: 'date' },
            { id: 'eval-url', label: 'Eval URL:', type: 'text', value: window.location.href, readonly: true },
            { id: 'eval-id', label: 'Eval ID:', type: 'text', value: window.location.pathname.split('/')[2], readonly: true },
            { id: 'eval-systems', label: 'Eval systems:', type: 'textarea' },
            { id: 'eval-images', label: 'Eval images:', type: 'textarea' },
        ];
    }

    function createCloseButton() {
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
        closeButton.style.zIndex = '10001'; // Ensure the close button is above the form
        closeButton.addEventListener('click', function () {
            const formContainer = document.getElementById('searchevals-form');
            formContainer.style.display = 'none'; // Hide the form container when the close button is clicked
        });
        return closeButton;
    }

    function createCollapseButton() {
        const collapseButton = document.createElement('button');
        collapseButton.textContent = '-';
        collapseButton.style.position = 'absolute';
        collapseButton.style.top = '5px';
        collapseButton.style.right = '30px'; // Positioning it a bit left to the close button
        collapseButton.style.zIndex = '10001'; // Ensure the collapse button is above the form
        collapseButton.addEventListener('click', function () {
            const formContainer = document.getElementById('searchevals-form');
            const formTitle = document.getElementById('form-title');
            if (formContainer.style.height === '15px') {
                formContainer.style.height = '';
                formContainer.style.width = '80%';
                formContainer.style.top = '10%';
                formContainer.style.overflow = 'auto';
                
                collapseButton.textContent = '-';
                formContainer.querySelectorAll('h2, label, input, textarea').forEach(element => {
                    element.style.visibility = 'visible'; // Unhide all text elements
                });
                formTitle.style.fontSize = 'initial'; // Reset title font size to default
            } else {
                formContainer.style.height = '15px'; // Collapse the form container
                formContainer.style.width = '50px'; // Collapse the form container
                formContainer.style.overflow = 'hidden'; // Hide all the text when collapsed
                formContainer.querySelectorAll('h2, label, input, textarea').forEach(element => {
                    element.style.visibility = 'hidden'; // Hide all text elements
                });
                formContainer.style.top = '15px'; // Move the form container to the very top
                collapseButton.textContent = '+';
                formTitle.style.fontSize = '10px'; // Make title font size smaller when collapsed
            }
        });
        return collapseButton;
    }


    function autofillDetails() {

        function getDatetime(tweetLink) {
            const statusID = tweetLink.split('/')[3]
            console.log(`statusID: ${statusID}`)
            let datetime;
            // get all anchor elements
            let a = document.getElementsByTagName('a');
            // filter anchor elements for href attr matching the statusID,
            //check TIME elements in children of those anchors for datetime attr
            for (let i = 0; i < a.length; i++) {
                if (a[i].href.includes(statusID)) {
                    // check for time element in children
                    let timeElement = a[i].querySelector('time');
                    if (timeElement) {
                        datetime = timeElement.getAttribute('datetime');
                        break;
                    }
                }
            }
            // if no datetime found, alert user of failure and crash.
            if (!datetime) {
                alert("searchevals.extract: No datetime found. Please try again or submit an issue at https://github.com/danielsgriffin/searchevals/issues/new/");
                throw new Error("searchevals.extract: No datetime found. Please try again.");
            }

            datetime = new Date(datetime).toISOString().split('T')[0];

            return datetime;
        }


        const usernameField = document.getElementById('evaluator-id');
        const contentField = document.getElementById('eval-content');
        const profileField = document.getElementById('evaluator-profile');
        const nameField = document.getElementById('evaluator-name');
        const nameReadOnlyField = document.getElementById('evaluator-name-readonly');
        const urlField = document.getElementById('evaluator-url');
        const dateField = document.getElementById('eval-date');
        if (usernameField && urlField && dateField && nameField && profileField) {
            // Extract username from URL or from the page
            const tweetPath = window.location.pathname
            const username = tweetPath.split('/')[1];
            usernameField.value = username;
            urlField.value = `https://twitter.com/${username}`;
            // Autofill the date
            nameField.value = document.querySelector('a[href="/' + username + '"] div[dir="ltr"] > span:first-child > span').innerText;
            nameReadOnlyField.value = nameField.value
            dateField.value = getDatetime(tweetPath);
            contentField.value = findTweetText(tweetPath);
            getAccountData(username).then(accountData => {
                let cleanedData = accountData.split(`@${username}`)[1].replace(/\d{1,3}(,\d{3})*\s+Following\s*\d{1,3}(,\d{3})*\s+Followers/, '').trim();
                profileField.innerText = cleanedData;
                
            }).catch(error => console.error(error));
            
            const imagesField = document.getElementById('images');
            if (imagesField) {
                imagesField.value = findImagesInTweet(tweetPath).join('\n');
            }
        }

    }

    function findImagesInTweet(tweetPath) {
        const tweetElement = document.querySelector(`a[href="${tweetPath}"]`).closest('article');
        if (!tweetElement) {
            console.log("Tweet element not found");
            return [];
        }

        const imageElements = tweetElement.querySelectorAll('img');
        const images = [];

        imageElements.forEach(img => {
            if (img.src.startsWith('https://pbs.twimg.com') && img.src.endsWith('format=jpg&name=medium')) {
                images.push(img.src);
            }
        });

        console.log("Images found: ", images);
        return images;
    }

    // Simplified approach to find tweet text based on a given tweet path
    const findTweetText = (tweetPath) => {
        // Attempt to find the specific tweet's 'a' element by its path
        let aElement = document.querySelector(`a[href="${tweetPath}"]`);
        let textElement;

        if (aElement) {
            // Navigate up the DOM tree to find the ancestor that likely contains the tweet text
            let ancestor = aElement.closest('article'); // Assuming 'article' is a common ancestor for tweets

            // Attempt to find the 'div' containing the tweet text within the ancestor
            if (ancestor) {
                textElement = ancestor.querySelector('div[dir="auto"][data-testid="tweetText"]');
            }
        }

        // Fallback to the first tweet's text if specific tweet's text is not found
        textElement = textElement || document.querySelector('div[dir="auto"][data-testid="tweetText"]');

        // Extract and return the tweet text or a default message if not found
        return textElement ? textElement.textContent.trim() : "Text not found";
    };

    async function getAccountData(username) {
        const links = document.querySelectorAll(`a[href="/${username}"]`);
        console.log(`Total links found: ${links.length}`);
        if (links.length >= 4) { // Ensure there are at least 4 links
            // Hover over the 2nd, 3rd, and 4th links
            [1, 2, 3].forEach(index => {
                console.log(`Dispatching mouseover to link at index: ${index}`);
                links[index].dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }));
            });

            // Return a promise that resolves when the text is found
            return new Promise((resolve, reject) => {
                const observer = new MutationObserver((mutations) => {
                    for (let mutation of mutations) {
                        if (mutation.addedNodes.length) {
                            for (let node of mutation.addedNodes) {
                                if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
                                    const textContent = node.textContent || node.innerText;
                                    if (textContent && textContent.trim() !== '') {
                                        console.log(`Text found: "${textContent.trim()}"`);
                                        observer.disconnect(); // Stop observing once we have the text
                                        resolve(textContent.trim()); // Resolve the promise with the text
                                        return;
                                    }
                                }
                            }
                        }
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true });

                // Fallback: if text is not found within a certain timeout, reject the promise
                setTimeout(() => {
                    observer.disconnect(); // Ensure to disconnect the observer to avoid memory leaks
                    console.log("Timeout reached. Profile text not found.");
                    reject(new Error("Profile text not found within the timeout period."));
                }, 5000); // Timeout after 5000ms (5 seconds)
            });
        } else {
            console.log("Less than four links found for the username.");
            return Promise.reject(new Error("Less than four links found for the username."));
        }
    }

    function generateAndCopyJSON(buttonId) {
        // Collect Evaluator data from the form
        const evaluator = {
            id: document.getElementById('evaluator-id').value,
            name: document.getElementById('evaluator-name').value,
            role: document.getElementById('evaluator-role').value,
            URL: document.getElementById('evaluator-url').value,
            conflict: [] // Placeholder for conflicts
        };

        // Collecting Evals data from form fields
        const evals = {
            id: "eval-" + Math.random().toString(36).substr(2, 9),
            date: document.getElementById('eval-date').value,
            query: document.getElementById('eval-query').value.trim(),
            url: document.getElementById('eval-url').value.trim() || window.location.href,
            systems: document.getElementById('systems').value.split(',').map(system => system.trim()),
            content: document.getElementById('eval-content').value.trim(),
            evaluator_id: evaluator.id,
        };

        let data;
        let isValid = false; // Initialize validation flag

        if (buttonId === 'generate-evaluator-json-button') {
            data = evaluator;
            isValid = validateFormData({}, evaluator, buttonId); // Validate only the evaluator data
        } else if (buttonId === 'generate-eval-json-button') {
            data = evals;
            isValid = validateFormData(evals, {}, buttonId); // Validate only the evals data
        }

        if (!isValid) {
            return; // Stop the function if validation fails
        }

        // Convert the JavaScript object to a JSON string with pretty printing
        const jsonString = JSON.stringify(data, null, 2);

        // Copy the JSON string to the clipboard
        GM_setClipboard(",\n" + jsonString);

        alert("JSON has been copied to the clipboard.");
    }
    
    function validateFormData(evals, evaluator, buttonId) {
        let errors = []; // Initialize an array to collect error messages

        // Validation for generating evaluator JSON
        if (buttonId === 'generate-evaluator-json-button') {
            // Ensure evaluator.role exists and is not empty
            if (!evaluator.role || evaluator.role.trim() === "") {
                errors.push("Role must exist.");
            }
        }

        // Validation for generating evals JSON
        if (buttonId === 'generate-eval-json-button') {
            // Ensure evals.content is not empty
            if (!evals.content || evals.content.trim() === "") {
                errors.push("Content cannot be empty.");
            }
            // Ensure evals.query exists and is not empty
            if (!evals.query || evals.query.trim() === "") {
                errors.push("Query must exist.");
            }
            // Ensure evals.systems is not empty
            if (!evals.systems || evals.systems.length === 0 || evals.systems.every(system => system.trim() === "")) {
                errors.push("Systems cannot be empty.");
            }
        }

        // Check if there were any errors collected
        if (errors.length > 0) {
            alert("Errors found:\n" + errors.join("\n"));
            return false;
        }

        return true; // Validation passed
    }
})();
