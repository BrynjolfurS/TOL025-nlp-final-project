
///////////////////////// TODO:  ///////////////////

// List of coarse-grained aspect classes (options for select element)
let aspectList = [
    "Gameplay Mechanics",
    "Graphics and Visuals",
    "Story and Narrative",
    "Audio Design and Soundtrack",
    "Performance and Optimization",
    "Support",
    "Monetization",
    "Level Design",
    "Game Balance",
    "Multiplayer Experience",
    "Replayability",
    "User Interface"
  ];

const DATA_PATH = '../Final_Assignment/data/sample_reviews.csv';
const OUTPUT_PATH = '../Final_Assignment/data/annotated_reviews.csv';

// Event listener for file selection button
document.getElementById('csvFileInput').addEventListener('change', readFile);


// Initialize page index
let currentPageIndex = 0;
// Container for all aspects not yet submitted
let pageAspects = [];
// Container for review data
let reviewsArray;

// Function to read csv file and store relevant data
function readFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const csvData = e.target.result;
        // Process the CSV data (e.g., parse it into an array of objects)
        reviewsArray = parseCSV(csvData);
        // Now you can use the reviewsArray as needed
        console.log(reviewsArray);
    };

    reader.readAsText(file);
    setTimeout(displayReview, 2000);
}

// Function to append chosen aspects and associated sentiment to the csv container
function appendPageAspectsToCsv() {
    const csvContainer = document.getElementById('csv-container');
    pageAspects[currentPageIndex].forEach(e => {    
        const line = e.join(',');
        csvContainer.value += `${reviewsArray[currentPageIndex].reviews},${line}\r\n`;
    });
}
    

// Function to parse CSV data
function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    const reviews = [];

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
        const reviewObj = { id: row[0], recommendation: row[6], reviews: row[7], title: row[8] };
        reviews.push(reviewObj);
        pageAspects.push([]);
    }

    return reviews;
}

// Function to display reviews
function displayReview() {
    const reviewContainer = document.getElementById('review-container');
    reviewContainer.innerHTML = review(reviewsArray[currentPageIndex].reviews);
    document.getElementById('current-page-index').textContent = currentPageIndex + " of " + reviewsArray.length;
    displayAspects();
}

// Function to retrieve and display aspects for the current review/page
function displayAspects() {
    const addedAspects = document.getElementById('aspect-container');
    addedAspects.innerHTML = ""; // Clear existing content

    // Create a table
    const table = document.createElement('table');
    table.classList.add('aspect-table'); // Optional: Add a CSS class for styling

    // Create the table header (thead)
    const tableHead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Span', 'Label', 'Ordinal', '']; // Add an empty cell for the remove button
    headers.forEach((headerText) => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });
    tableHead.appendChild(headerRow);
    table.appendChild(tableHead);

	// Iterates through unsubmitted aspects of current page and generates html elements to display
    pageAspects[currentPageIndex].forEach((element, index) => {
        // Create a table row
        const row = document.createElement('tr');
        row.id = `aspect-row-${index}`;

        // Create table cells (columns)
        const spanCell = document.createElement('td');
        spanCell.textContent = element[0];
        const labelCell = document.createElement('td');
        labelCell.textContent = element[1];
        const ordinalCell = document.createElement('td');
        ordinalCell.textContent = element[2];
        const removeBtnCell = document.createElement('td');
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.id = `rb${index}`;
        removeBtn.onclick = removeAspect;
        removeBtnCell.appendChild(removeBtn);

        // Append cells to the row
        row.appendChild(spanCell);
        row.appendChild(labelCell);
        row.appendChild(ordinalCell);
        row.appendChild(removeBtnCell);

        // Append the row to the table
        table.appendChild(row);
    });

    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit aspects';
    submitBtn.onclick = appendPageAspectsToCsv;
    // Append the table to the addedAspects container
    addedAspects.appendChild(table);
    addedAspects.appendChild(submitBtn);
}


// Template for the review section
function review(text) {
    return `
    <section>
    <p>${text}</p>
    </section>
    `
}

// Function to add an aspect to current review
function appendAspect() {
    const currSpanV = document.getElementById('span-input');
    const currLabelV = document.getElementById('label-picker');
    const currOrdinalV = document.getElementById('ordinal-picker');
    pageAspects[currentPageIndex].push([
        currSpanV.value,
        currLabelV.value,
        currOrdinalV.value
    ])
    currSpanV.value = '';
    currLabelV.value = 'positive';
    currOrdinalV.value = '0';
    displayReview();
}

// Function removes chosen aspect from list of this review's aspects
function removeAspect() {
    const btnId = parseInt(this.id.charAt(2));
    pageAspects[currentPageIndex].splice(btnId,1);
    displayReview();
}

// Function puts value of selected aspect from select element into input element
function selectAspect() {
    let spanInput = document.getElementById('span-input');
    spanInput.value = document.getElementById('aspect-picker').value;
}

/* function selectLabel() {
    console.log(document.getElementById('label-picker').value);
} */

// Function to navigate to the next review
function nextReview() {
    currentPageIndex = (currentPageIndex + 1) % reviewsArray.length;
    displayReview();
}

// Function to navigate to the previous review
function prevReview() {
    currentPageIndex = (currentPageIndex - 1 + reviewsArray.length) % reviewsArray.length;
    displayReview();
}

// Event listeners for buttons
document.getElementById('next-btn').addEventListener('click', nextReview);
document.getElementById('prev-btn').addEventListener('click', prevReview);
document.getElementById('add-aspect-btn').addEventListener('click', appendAspect);

// Aspect picker (For Coarse-Grained Aspects only?)
aspectSelector = document.getElementById('aspect-picker');
for (let i = 0; i < aspectList.length; i++) {
    let opt = aspectList[i];
    let el = document.createElement('option');
    el.textContent = opt;
    el.value = opt;
    aspectSelector.appendChild(el);
}
//aspectSelector.onchange(selectAspect);

// Initial display
displayReview();

/* function displayAspects() {
    const addedAspects = document.getElementById('added-aspects');
    addedAspects.innerHTML = "";
    pageAspects[currentPageIndex].forEach((element, index) => {
        const item = document.createElement('li');
        item.classList.add('aspect-item');
        item.id = `aspect-${index}`;
        const span = document.createElement('p');
        span.textContent = element[0];
        const label = document.createElement('p');
        label.textContent = element[1];
        const ordinal = document.createElement('p');
        ordinal.textContent = element[2];
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.id = `rb${index}`;
        removeBtn.onclick = removeAspect;
        item.appendChild(span);
        item.appendChild(label);
        item.appendChild(ordinal);
        item.appendChild(removeBtn);
        addedAspects.appendChild(item);
    });
} */

/* function addAspect() {
    const aspectDiv = document.createElement('div');
    aspectDiv.classList.add('aspect-row');

    // Create the input elements
    const spanInput = document.createElement('input');
    spanInput.type = 'text';
    spanInput.id = `span-input-${aspectIdx}`;
    const spanLabel = document.createElement('label');
    spanLabel.textContent = 'Span:';
    spanLabel.htmlFor = `span-input-${aspectIdx}`;

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.id = `label-input-${aspectIdx}`;
    const labelLabel = document.createElement('label');
    labelLabel.textContent = 'Label:';
    labelLabel.htmlFor = `label-input-${aspectIdx}`;

    const ordinalInput = document.createElement('input');
    ordinalInput.type = 'text';
    ordinalInput.id = `ordinal-input-${aspectIdx}`;
    const ordinalLabel = document.createElement('label');
    ordinalLabel.textContent = 'Ordinal:';
    ordinalLabel.htmlFor = `ordinal-input-${aspectIdx}`;

    // Append the input elements and labels to the aspectDiv
    aspectDiv.appendChild(spanLabel);
    aspectDiv.appendChild(spanInput);
    aspectDiv.appendChild(document.createElement('br'));
    aspectDiv.appendChild(labelLabel);
    aspectDiv.appendChild(labelInput);
    aspectDiv.appendChild(document.createElement('br'));
    aspectDiv.appendChild(ordinalLabel);
    aspectDiv.appendChild(ordinalInput);

    // Append the aspectDiv to the existing "aspects" div
    const aspectsContainer = document.getElementById('aspects');
    aspectsContainer.appendChild(aspectDiv);

    aspectIdx += 1;
} */