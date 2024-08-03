document.addEventListener('DOMContentLoaded', () => {
    const plugins = [
        { id: 1, name: 'Plugin One', description: 'Description for plugin one.', version: '1.0.0', author: 'Author One', license: 'MIT', licenseUrl: 'https://www.mit-license.org/', downloadUrl: 'example.txt', repoUrl: 'https://github.com/user/plugin-one', category: 'Utility' },
        { id: 2, name: 'Plugin Two', description: 'Description for plugin two.', version: '1.1.0', author: 'Author Two', license: 'Apache 2.0', licenseUrl: 'https://www.opensource.org/license/apache-2-0/', downloadUrl: 'example.txt', repoUrl: 'https://github.com/user/plugin-two', category: 'Security' },
        { id: 3, name: 'Plugin Three', description: 'Description for plugin three.', version: '1.2.0', author: 'Author Three', license: 'GPLv3', licenseUrl: 'https://www.gnu.org/licenses/gpl-3.0.en.html', downloadUrl: 'example.txt', repoUrl: 'https://github.com/user/plugin-three', category: 'Utility' },
    ];

    const pluginContainer = document.getElementById('plugin-container');
    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('category-select');

    function displayPlugins(plugins) {
        pluginContainer.innerHTML = '';
        plugins.forEach(plugin => {
            const pluginCard = document.createElement('div');
            pluginCard.className = 'plugin-card';
            pluginCard.onclick = () => showPluginDetails(plugin.id);

            const pluginTitle = document.createElement('h2');
            pluginTitle.textContent = plugin.name;

            const pluginCategory = document.createElement('p');
            pluginCategory.textContent = `Category: ${plugin.category}`;

            pluginCard.appendChild(pluginTitle);
            pluginCard.appendChild(pluginCategory);

            pluginContainer.appendChild(pluginCard);
        });
    }

    function filterPlugins() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value;
        const filteredPlugins = plugins.filter(plugin => 
            (plugin.name.toLowerCase().includes(searchTerm) || plugin.description.toLowerCase().includes(searchTerm)) &&
            (selectedCategory === 'All' || plugin.category === selectedCategory)
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

    function toggleTheme() {
        const isDarkMode = document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }

    // Load saved theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('theme-toggle').checked = true;
    }

    if (pluginContainer) {
        searchInput.addEventListener('input', filterPlugins);
        categorySelect.addEventListener('change', filterPlugins);
        document.getElementById('theme-toggle').addEventListener('change', toggleTheme);
        displayPlugins(plugins);
    }

    if (window.location.pathname.endsWith('plugin.html')) {
        const selectedPlugin = JSON.parse(localStorage.getItem('selectedPlugin'));
        if (selectedPlugin) {
            document.getElementById('plugin-name').textContent = selectedPlugin.name;
            document.getElementById('plugin-description').textContent = `Description: ${selectedPlugin.description}`;
            document.getElementById('plugin-version').textContent = `Version: ${selectedPlugin.version}`;
            document.getElementById('plugin-author').textContent = `Author: ${selectedPlugin.author}`;
            document.getElementById('plugin-category').textContent = `Category: ${selectedPlugin.category}`;
            document.getElementById('plugin-license').href = selectedPlugin.licenseUrl;
            document.getElementById('plugin-license').textContent = `License: ${selectedPlugin.license}`;
            document.getElementById('plugin-repo').href = selectedPlugin.repoUrl;

            const downloadButton = document.getElementById('download-button');
            downloadButton.href = selectedPlugin.downloadUrl;
            downloadButton.setAttribute('download', selectedPlugin.downloadUrl);
        }

        document.getElementById('theme-toggle').addEventListener('change', toggleTheme);
    }
});
