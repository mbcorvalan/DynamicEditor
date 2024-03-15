// Element selection: buttons for adding content and containers for display.
const addTitleButton = document.querySelector('#addTitle');
const addDescriptionButton = document.querySelector('#addText');
const addImageButton = document.querySelector('#addImage');
const editorContainer = document.querySelector('#editor');
const markupContainer = document.querySelector('#markup');
const copyMarkUpButton = document.querySelector('#copyMarkupButton');

// A counter to ensure unique IDs for dynamically created elements.
let elementCounter = 0;

// Function to create an input element of a specified type (title, text, image).
const createInput = (type) => {
    // Generate a unique ID for each element.
    const elementId = `element-${elementCounter++}`;
    
    // Create a container for the input and associated controls.
    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-container flex flex-col gap-2';
    inputContainer.innerHTML = `
        <p class="text-lg text-gray-700 p-4">${type} element</p>
        <div class="flex items-center gap-2">
            <input data-id="${elementId}" placeholder="Insert ${type === "image" ? "URL" : type}..." class="${type}-input w-4/5 p-2 text-base text-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white shadow-sm">
            <button class="delete-button w-1/5 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:shadow-outline" data-id="${elementId}">Delete</button>
        </div>
    `;

    // Append the input container to the editor container.
    editorContainer.appendChild(inputContainer);

    // Event listener for input changes to update the markup container.
    const inputElement = inputContainer.querySelector('input');
    inputElement.addEventListener('input', () =>
        updateMarkup(inputElement.value, type, elementId)
    );

    // Delete element event listener.
    inputContainer.querySelector('.delete-button').addEventListener('click', () => {
        inputContainer.remove();
        document.querySelector(`#${elementId}`).remove();
    });

    // Add a placeholder element in the markup container.
    const markupElement = document.createElement('div');
    markupElement.id = elementId;
    markupElement.className = `${type}-markup`;
    markupContainer.appendChild(markupElement);
};

// Function to update the markup display based on input type and value.
const updateMarkup = (value, type, id) => {
    const markupElement = document.querySelector(`#${id}`);
    let contentHTML;

    // Generate HTML content based on the input type.
    switch (type) {
        case 'title':
            contentHTML = `<div class="flex items-center gap-2 mt-5 mr-5 mb-5 ml-0">
			<h2 class="title text-2xl text-gray-800 my-0">${value}</h2>
		</div>`;
            break;
        case 'text':
            contentHTML = `<div class="flex items-center gap-2 mt-5 mr-5 mb-5 ml-0">
			<p class="description text-base text-gray-700 my-0">${value}</p>
			<div class="italic-container bg-blue-500 text-white p-2">
			<button class="apply-italic">Italic</button>
		</div>
		<div class="bold-container bg-green-500 text-white p-2">
		<button class="apply-bold">Bold</button>
	</div>
		</div>`;
            break;
        case 'image':
            contentHTML = value ? `<div class="flex items-center gap-2 mt-5 mr-5 mb-5 ml-0">
			<img src=${image.value}>
		</div>` : 'Insert image URL...';
            break;
    }

    // Set the generated HTML content to the markup element.
    markupElement.innerHTML = contentHTML;
};

// Event listener for markup container clicks to apply styles.
markupContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('apply-italic')) {
        const container = e.target.closest('div.flex.items-center');
        const p = container.querySelector('.description');
        p.classList.toggle('italic');
    }
    if (e.target.classList.contains('apply-bold')) {
        const container = e.target.closest('div.flex.items-center');
        const p = container.querySelector('.description');
        p.classList.toggle('font-semibold');
    }
});

// Event listener for the copy button to copy markup container's HTML to clipboard.
copyMarkUpButton.addEventListener('click', () => {
    const copyHTML = markupContainer.cloneNode(true);
    copyHTML.querySelectorAll('.italic-container, .bold-container').forEach(container => container.remove());
    navigator.clipboard.writeText(copyHTML.innerHTML)
        .then(() => {
            // Show success notification.
            const notification = document.getElementById('copyNotification');
            notification.classList.replace('hidden', 'opacity-100');
            setTimeout(() => notification.classList.replace('opacity-100', 'hidden'), 2000);
        })
        .catch(() => {
            // Show error notification.
            const error = document.getElementById('copyErrorButton');
            error.classList.replace('hidden', 'opacity-100');
            setTimeout(() => error.classList.replace('opacity-100', 'hidden'), 2000);
        });
});

// Function to execute when changes are detected within the 'markup' div
const onMutation = (mutationsList, observer) => {
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            if(markupContainer.children.length > 0) {
                copyMarkUpButton.className = "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            } else {
				console.log("se pone gris")
				copyMarkUpButton.className = "px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
            }
        }
    }
};

// Create a MutationObserver instance and pass the function to execute when mutations are detected
const observer = new MutationObserver(onMutation);

// Configuration options for the observer: observe child additions or deletions
const config = { childList: true };

// Start observing
observer.observe(markupContainer, config);

// Remember, you can stop the observation with observer.disconnect() if necessary


// Event listeners for adding title, description, and image elements.
addTitleButton.addEventListener('click', () => createInput('title'));
addDescriptionButton.addEventListener('click', () => createInput('text'))
addImageButton.addEventListener('click', () => createInput('image'))

