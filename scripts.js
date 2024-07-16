document.addEventListener('DOMContentLoaded', () => {
    const plugins = [
        { id: 1, name: 'Plugin One', description: 'Description for plugin one.', version: '1.0.0', author: 'Author One', downloadUrl: 'example.txt' },
        { id: 2, name: 'Plugin Two', description: 'Description for plugin two.', version: '1.1.0', author: 'Author Two', downloadUrl: 'example.txt' },
        { id: 3, name: 'Plugin Three', description: 'Description for plugin three.', version: '1.2.0', author: 'Author Three', downloadUrl: 'example.txt' },
    ];

    const reviews = {
        1: [
            { name: 'Alice', rating: 5, comment: 'Excellent plugin!' },
            { name: 'Bob', rating: 4, comment: 'Very good, but could be improved.' },
            { name: 'Charlie', rating: 3, comment: 'Average plugin.' },
            { name: 'Dave', rating: 5, comment: 'Fantastic!' },
            { name: 'Eve', rating: 4, comment: 'Great plugin!' },
            { name: 'Frank', rating: 2, comment: 'Not what I expected.' },
            { name: 'Grace', rating: 5, comment: 'Highly recommend!' }
        ],
        2: [
            { name: 'Charlie', rating: 3, comment: 'Average plugin.' }
        ],
        3: []
    };

    const pluginContainer = document.getElementById('plugin-container');
    const searchInput = document.getElementById('search');
    const reviewsPerPage = 3;
    let currentPage = 1;

    function calculateAverageRating(pluginId) {
        const pluginReviews = reviews[pluginId] || [];
        if (pluginReviews.length === 0) return 0;
        const totalRating = pluginReviews.reduce((sum, review) => sum + review.rating, 0);
        return (totalRating / pluginReviews.length).toFixed(1);
    }

    function displayPlugins(plugins) {
        pluginContainer.innerHTML = '';
        plugins.forEach(plugin => {
            const pluginCard = document.createElement('div');
            pluginCard.className = 'plugin-card';
            pluginCard.onclick = () => showPluginDetails(plugin.id);

            const pluginTitle = document.createElement('h2');
            pluginTitle.textContent = plugin.name;

            const pluginDescription = document.createElement('p');
            pluginDescription.textContent = plugin.description;

            const averageRating = calculateAverageRating(plugin.id);
            const pluginRating = document.createElement('p');
            pluginRating.textContent = `Rating: ${averageRating} stars`;

            pluginCard.appendChild(pluginTitle);
            pluginCard.appendChild(pluginDescription);
            pluginCard.appendChild(pluginRating);

            pluginContainer.appendChild(pluginCard);
        });
    }

    function filterPlugins() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredPlugins = plugins.filter(plugin =>
            plugin.name.toLowerCase().includes(searchTerm) ||
            plugin.description.toLowerCase().includes(searchTerm)
        );
        displayPlugins(filteredPlugins);
    }

    function showPluginDetails(pluginId) {
        const plugin = plugins.find(p => p.id === pluginId);
        if (plugin) {
            localStorage.setItem('selectedPlugin', JSON.stringify(plugin));
            window.location.href = 'plugin.html';
        }
    }

    function displayReviews(pluginId, page = 1) {
        const reviewsContainer = document.getElementById('reviews-container');
        reviewsContainer.innerHTML = '';
        const pluginReviews = reviews[pluginId] || [];
        const start = (page - 1) * reviewsPerPage;
        const end = start + reviewsPerPage;
        const paginatedReviews = pluginReviews.slice(start, end);

        paginatedReviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review';

            const reviewName = document.createElement('h4');
            reviewName.textContent = `${review.name} - ${review.rating} stars`;

            const reviewComment = document.createElement('p');
            reviewComment.textContent = review.comment;

            reviewElement.appendChild(reviewName);
            reviewElement.appendChild(reviewComment);

            reviewsContainer.appendChild(reviewElement);
        });

        // Add pagination controls
        displayPaginationControls(pluginId, page, pluginReviews.length);
    }

    function displayPaginationControls(pluginId, page, totalReviews) {
        const paginationContainer = document.getElementById('pagination-controls');
        paginationContainer.innerHTML = '';

        const totalPages = Math.ceil(totalReviews / reviewsPerPage);

        if (totalPages > 1) {
            if (page > 1) {
                const prevButton = document.createElement('button');
                prevButton.textContent = 'Previous';
                prevButton.onclick = () => displayReviews(pluginId, page - 1);
                paginationContainer.appendChild(prevButton);
            }

            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = i;
                pageButton.onclick = () => displayReviews(pluginId, i);
                if (i === page) {
                    pageButton.disabled = true;
                }
                paginationContainer.appendChild(pageButton);
            }

            if (page < totalPages) {
                const nextButton = document.createElement('button');
                nextButton.textContent = 'Next';
                nextButton.onclick = () => displayReviews(pluginId, page + 1);
                paginationContainer.appendChild(nextButton);
            }
        }
    }

    function handleReviewFormSubmit(event) {
        event.preventDefault();
        const pluginId = JSON.parse(localStorage.getItem('selectedPlugin')).id;
        const name = document.getElementById('reviewer-name').value;
        const rating = parseInt(document.getElementById('reviewer-rating').value);
        const comment = document.getElementById('reviewer-comment').value;

        const newReview = { name, rating, comment };
        if (!reviews[pluginId]) {
            reviews[pluginId] = [];
        }
        reviews[pluginId].push(newReview);

        displayReviews(pluginId, currentPage);
        document.getElementById('review-form').reset();
        displayPlugins(plugins); // Update the ratings on the main page
    }

    if (pluginContainer) {
        searchInput.addEventListener('input', filterPlugins);
        displayPlugins(plugins);
    }

    if (window.location.pathname.endsWith('plugin.html')) {
        const selectedPlugin = JSON.parse(localStorage.getItem('selectedPlugin'));
        if (selectedPlugin) {
            document.getElementById('plugin-name').textContent = selectedPlugin.name;
            document.getElementById('plugin-description').textContent = `Description: ${selectedPlugin.description}`;
            document.getElementById('plugin-version').textContent = `Version: ${selectedPlugin.version}`;
            document.getElementById('plugin-author').textContent = `Author: ${selectedPlugin.author}`;

            const downloadButton = document.getElementById('download-button');
            downloadButton.href = selectedPlugin.downloadUrl;
            downloadButton.setAttribute('download', selectedPlugin.downloadUrl);

            displayReviews(selectedPlugin.id);
        }

        const reviewForm = document.getElementById('review-form');
        reviewForm.addEventListener('submit', handleReviewFormSubmit);
    }
});
