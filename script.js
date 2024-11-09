document.addEventListener('DOMContentLoaded', function() {
    // Function to scan the directory and fetch page links
    function fetchDirectoryContents() {
        return fetch('./categories/')
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const links = Array.from(doc.querySelectorAll('a'));
                return links
                    .filter(link => link.href.endsWith('.html'))
                    .map(link => ({
                        title: link.textContent.trim() || link.href.split('/').pop().replace('.html', ''),
                        url: link.href
                    }));
            })
            .catch(error => {
                console.error('Error fetching directory contents:', error);
                return [];
            });
    }

    // Function to add pages to the navigation menu
    function addPagesToMenu(pagesData) {
        const navMenu = document.getElementById('nav-menu');

        pagesData.forEach(page => {
            const pageListItem = document.createElement('li');
            const pageLink = document.createElement('a');
            pageLink.href = page.url;
            pageLink.textContent = page.title;
            pageListItem.appendChild(pageLink);
            navMenu.appendChild(pageListItem);
        });
    }

    // Fetch directory contents and add to the menu on page load
    fetchDirectoryContents().then(addPagesToMenu);
});
