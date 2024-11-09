// Load JSON data from index.json file
$(document).ready(() => {
    loadMenuState(); // Load saved state first to ensure it's present before adding new items

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
            saveMenuState(); // Save the updated state after adding all items
        })
        .catch(error => console.error('Error loading JSON:', error));
});

// Function to add a page to the navigation menu under its category
function addPageToMenu(directory, pageUrl, pageTitle) {
    // Remove the base directory from the category path
    const categoryPath = directory.split('/').filter(Boolean);

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

    saveMenuState(); // Save the menu state each time an item is added to ensure consistency
}

// Function to convert a file name to a more readable format
function getPageName(fileName) {
    return fileName
        .replace('.html', '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}

// Function to save the current state of the menu to localStorage
function saveMenuState() {
    const menuHtml = $('#nav-menu').html();
    localStorage.setItem('navMenuState', menuHtml);
}

// Function to load the menu state from localStorage
function loadMenuState() {
    const savedMenuHtml = localStorage.getItem('navMenuState');
    if (savedMenuHtml) {
        $('#nav-menu').html(savedMenuHtml);
    }
}
