document.addEventListener('DOMContentLoaded', function() {
    // Load JSON data from index.json file
fetch('./index.json')
.then(response => response.json())
.then(jsonData => {
    jsonData.forEach(categoryObj => {
        const category = categoryObj.category;
        const pages = categoryObj.page || categoryObj.pages;

        pages.forEach(page => {
            addPageToMenu(category, page.url, page.title);
        });
    });
})
.catch(error => console.error('Error loading JSON:', error));

// Function to add a page to the navigation menu under its category
function addPageToMenu(directory, pageUrl, pageTitle) {
// Remove the base directory from the category path
const relativeDirectory = directory.replace(baseDirectory, '').replace(/\/$/, '');
const categoryPath = relativeDirectory.split('/').filter(Boolean);

// Traverse or create the nested list structure
let currentMenu = $('#nav-menu');
categoryPath.forEach(category => {
    let categoryListItem = currentMenu.children(`li[data-category="${category}"]`);
    if (categoryListItem.length === 0) {
        categoryListItem = $('<li>').attr('data-category', category).text(category);
        const subMenu = $('<ul>');
        categoryListItem.append(subMenu);
        currentMenu.append(categoryListItem);
    }
    currentMenu = categoryListItem.children('ul');
});

// Add the page under the correct category
const pageLink = $('<a>').attr('href', pageUrl).text(pageTitle);
const pageListItem = $('<li>').append(pageLink);
currentMenu.append(pageListItem);
}
});
