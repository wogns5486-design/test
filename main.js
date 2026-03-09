const cryptoContainer = document.getElementById('crypto-container');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = 'Light Mode';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = 'Light Mode';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = 'Dark Mode';
    }
});

async function fetchCryptos() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
        const cryptos = await response.json();

        cryptoContainer.innerHTML = ''
        cryptos.forEach(crypto => {
            const cryptoCard = document.createElement('div');
            cryptoCard.classList.add('crypto-card');

            cryptoCard.innerHTML = `
                <h2>${crypto.name}</h2>
                <p>Symbol: ${crypto.symbol.toUpperCase()}</p>
                <p>Price: $${crypto.current_price}</p>
                <p>Market Cap: $${crypto.market_cap.toLocaleString()}</p>
            `;

            cryptoContainer.appendChild(cryptoCard);
        });
    } catch (error) {
        console.error('Error fetching crypto data:', error);
        cryptoContainer.innerHTML = '<p>Could not fetch cryptocurrency data. Please try again later.</p>';
    }
}

fetchCryptos();
