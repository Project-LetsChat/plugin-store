document.addEventListener('DOMContentLoaded', () => {
    const plugins = [
        { id: 1, name: 'Plugin One', description: 'Description for plugin one.', version: '1.0.0', author: 'Author One' },
        { id: 2, name: 'Plugin Two', description: 'Description for plugin two.', version: '1.1.0', author: 'Author Two' },
        { id: 3, name: 'Plugin Three', description: 'Description for plugin three.', version: '1.2.0', author: 'Author Three' },
    ];

    const reviews = {
        1: [
            { name: 'Alice', rating: 5, comment: 'Excellent plugin!' },
            { name: 'Bob', rating: 4, comment: 'Very good, but could be improved.' }
        ],
        2: [
            { name: 'Charlie', rating: 3, comment: 'Average plugin.' }
        ],
        3: []
    };

    const pluginContainer = document.getElementById('plugin-container');
    const searchInput = document.getElementById('search');

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

    function displayReviews(pluginId) {
        const reviewsContainer = document.getElementById('reviews-container');
        reviewsContainer.innerHTML = '';
        const pluginReviews = reviews[pluginId] || [];
        pluginReviews.forEach(review => {
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

        displayReviews(pluginId);
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
            displayReviews(selectedPlugin.id);
        }

        const reviewForm = document.getElementById('review-form');
        reviewForm.addEventListener('submit', handleReviewFormSubmit);
    }
});
