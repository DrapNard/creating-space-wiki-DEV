// Load JSON data from index.json file
$(document).ready(() => {
    try {
        loadMenuState(); // Load saved state first to ensure it's present before adding new items

        fetch('./index.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(jsonData => {
                if (!Array.isArray(jsonData)) {
                    throw new Error('Invalid JSON data format');
                }

                jsonData.forEach(categoryObj => {
                    const category = categoryObj.category;
                    const pages = categoryObj.page || categoryObj.pages || [];

                    if (!Array.isArray(pages)) {
                        console.warn(`Invalid pages format for category: ${category}`);
                        return;
                    }

                    pages.forEach(page => {
                        if (page && page.url && page.title) {
                            addPageToMenu(category, page.url, page.title);
                        }
                    });
                });
                saveMenuState(); // Save the updated state after adding all items
            })
            .catch(error => {
                console.error('Error loading or processing JSON:', error);
                showErrorMessage('Failed to load navigation menu');
            });
    } catch (error) {
        console.error('Error in document ready handler:', error);
    }
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
    try {
        const menuHtml = $('#nav-menu').html();
        if (menuHtml) {
            localStorage.setItem('navMenuState', menuHtml);
        }
    } catch (error) {
        console.error('Error saving menu state:', error);
    }
}

// Function to load the menu state from localStorage
function loadMenuState() {
    try {
        const savedMenuHtml = localStorage.getItem('navMenuState');
        if (savedMenuHtml) {
            $('#nav-menu').html(savedMenuHtml);
        }
    } catch (error) {
        console.error('Error loading menu state:', error);
    }
}

// Function to show error message to user
function showErrorMessage(message) {
    const errorDiv = $('<div>')
        .addClass('error-message')
        .text(message)
        .css({
            'background-color': '#ff4444',
            'color': 'white',
            'padding': '10px',
            'margin': '10px 0',
            'border-radius': '4px',
            'text-align': 'center'
        });
    
    $('#nav-menu').before(errorDiv);
    setTimeout(() => errorDiv.fadeOut('slow', function() { $(this).remove(); }), 5000);
}
