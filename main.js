const cryptoContainer = document.getElementById('crypto-container');
const themeToggle = document.getElementById('theme-toggle');
const langToggle = document.getElementById('lang-toggle');
const body = document.body;

// Translations
const translations = {
    en: {
        siteTitle: "Crypto Recommendations",
        themeDark: "Dark Mode",
        themeLight: "Light Mode",
        exchangeTitle: "Popular Exchanges",
        contactTitle: "Partner with Us",
        labelName: "Name",
        labelEmail: "Email",
        labelMessage: "Message",
        submitBtn: "Send Inquiry",
        commentsTitle: "Comments",
        footerText: "© 2024 Crypto Recommendations",
        symbol: "Symbol",
        price: "Price",
        marketCap: "Market Cap",
        langBtn: "한국어"
    },
    ko: {
        siteTitle: "가상화폐 추천",
        themeDark: "다크 모드",
        themeLight: "라이트 모드",
        exchangeTitle: "주요 거래소",
        contactTitle: "제휴 문의",
        labelName: "이름",
        labelEmail: "이메일",
        labelMessage: "메시지",
        submitBtn: "문의하기",
        commentsTitle: "댓글",
        footerText: "© 2024 가상화폐 추천 서비스",
        symbol: "심볼",
        price: "가격",
        marketCap: "시가총액",
        langBtn: "English"
    }
};

let currentLang = localStorage.getItem('lang') || 'en';

function updateLanguage() {
    const t = translations[currentLang];
    document.getElementById('site-title').textContent = t.siteTitle;
    document.getElementById('exchange-title').textContent = t.exchangeTitle;
    document.getElementById('contact-title').textContent = t.contactTitle;
    document.getElementById('label-name').textContent = t.labelName;
    document.getElementById('label-email').textContent = t.labelEmail;
    document.getElementById('label-message').textContent = t.labelMessage;
    document.getElementById('submit-btn').textContent = t.submitBtn;
    document.getElementById('comments-title').textContent = t.commentsTitle;
    document.getElementById('footer-text').textContent = t.footerText;
    langToggle.textContent = t.langBtn;
    
    const isDark = body.classList.contains('dark-mode');
    themeToggle.textContent = isDark ? t.themeLight : t.themeDark;
    
    // Refresh crypto list to update labels
    fetchCryptos();
}

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? translations[currentLang].themeLight : translations[currentLang].themeDark;
});

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ko' : 'en';
    localStorage.setItem('lang', currentLang);
    updateLanguage();
});

async function fetchCryptos() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
        const cryptos = await response.json();
        const t = translations[currentLang];

        cryptoContainer.innerHTML = '';
        cryptos.forEach(crypto => {
            const cryptoCard = document.createElement('div');
            cryptoCard.classList.add('crypto-card');

            cryptoCard.innerHTML = `
                <h2>${crypto.name}</h2>
                <p>${t.symbol}: ${crypto.symbol.toUpperCase()}</p>
                <p>${t.price}: $${crypto.current_price.toLocaleString()}</p>
                <p>${t.marketCap}: $${crypto.market_cap.toLocaleString()}</p>
            `;

            cryptoContainer.appendChild(cryptoCard);
        });
    } catch (error) {
        console.error('Error fetching crypto data:', error);
        cryptoContainer.innerHTML = '<p>Error loading data.</p>';
    }
}

// Initial update
updateLanguage();
fetchCryptos();
