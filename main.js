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
        langBtn: "한국어",
        loading: "Loading..."
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
        langBtn: "English",
        loading: "데이터 로딩 중..."
    }
};

// Simplified summaries for major coins (mock whitepaper summaries)
const coinSummaries = {
    en: {
        bitcoin: "A decentralized digital currency without a central bank, allowing peer-to-peer transactions on the blockchain.",
        ethereum: "A decentralized, open-source blockchain with smart contract functionality, powering decentralized apps (DApps).",
        tether: "A stablecoin pegged to the US dollar, providing a digital alternative to traditional fiat currency.",
        binancecoin: "The native utility token of the Binance ecosystem, used for trading fees, staking, and payments.",
        solana: "A high-performance blockchain supporting builders around the world creating crypto apps that scale.",
        ripple: "A digital payment protocol and cryptocurrency designed for fast and low-cost cross-border transactions.",
        usd_coin: "A digital stablecoin that is fully collateralized by US dollar assets, ensuring stability and transparency.",
        staked_ether: "A liquid staking token representing staked ETH in the Ethereum 2.0 network.",
        dogecoin: "A popular meme-inspired cryptocurrency that has evolved into a widely used digital payment method.",
        cardano: "A proof-of-stake blockchain platform that aims to allow changemakers to create positive global change."
    },
    ko: {
        bitcoin: "중앙은행이 없는 분권화된 디지털 통화로, 블록체인 상에서 개인 간 직접 거래를 가능하게 합니다.",
        ethereum: "스마트 계약 기능을 탑재한 분권형 오픈 소스 블록체인으로, 다양한 탈중앙화 앱(DApp)을 지원합니다.",
        tether: "미국 달러에 가치가 고정된 스테이블코인으로, 법정 화폐의 디지털 대안 역할을 수행합니다.",
        binancecoin: "바이낸스 생태계의 유틸리티 토큰으로, 거래 수수료 결제, 스테이킹 및 다양한 결제에 사용됩니다.",
        solana: "확장 가능한 가상화폐 앱 개발을 지원하는 전 세계 빌더들을 위한 고성능 블록체인 플랫폼입니다.",
        ripple: "빠르고 저렴한 국가 간 송금을 위해 설계된 디지털 결제 프로토콜이자 가상화폐입니다.",
        usd_coin: "미국 달러 자산에 의해 100% 담보되는 디지털 스테이블코인으로, 높은 안정성과 투명성을 제공합니다.",
        staked_ether: "이더리움 2.0 네트워크에 스테이킹된 ETH를 나타내는 유동성 스테이킹 토큰입니다.",
        dogecoin: "인기 있는 밈에서 시작된 가상화폐로, 현재는 널리 사용되는 디지털 결제 수단으로 발전했습니다.",
        cardano: "긍정적인 글로벌 변화를 목표로 하는 지분 증명(PoS) 기반의 블록체인 플랫폼입니다."
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
    themeToggle.textContent = isDark ? translations[currentLang].themeLight : translations[currentLang].themeDark;
    
    // Refresh crypto list to update labels and summaries
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
        const t = translations[currentLang];
        // If container is empty, show loading
        if (cryptoContainer.innerHTML === '') {
            cryptoContainer.innerHTML = `<p>${t.loading}</p>`;
        }

        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
        const cryptos = await response.json();

        cryptoContainer.innerHTML = '';
        cryptos.forEach((crypto, index) => {
            const cryptoRow = document.createElement('div');
            cryptoRow.classList.add('crypto-row');

            const summary = coinSummaries[currentLang][crypto.id] || 
                            (currentLang === 'en' ? "A leading digital asset in the blockchain ecosystem focused on innovation and security." : "혁신과 보안에 중점을 둔 블록체인 생태계의 주요 디지털 자산입니다.");

            cryptoRow.innerHTML = `
                <div class="crypto-info">
                    <span class="crypto-rank">${index + 1}</span>
                    <div class="crypto-name-container">
                        <span class="crypto-name">${crypto.name}</span>
                        <span class="crypto-symbol">${crypto.symbol.toUpperCase()}</span>
                    </div>
                    <div class="crypto-desc">${summary}</div>
                </div>
                <div class="crypto-price-container">
                    <p class="crypto-price">$${crypto.current_price.toLocaleString()}</p>
                    <span class="crypto-market-cap">MCap: $${Math.round(crypto.market_cap / 1000000).toLocaleString()}M</span>
                </div>
            `;

            cryptoContainer.appendChild(cryptoRow);
        });
    } catch (error) {
        console.error('Error fetching crypto data:', error);
        cryptoContainer.innerHTML = '<p>Error loading data. Please check your connection.</p>';
    }
}

// Initial update
updateLanguage();
// Removed second fetchCryptos() call as it is called inside updateLanguage()

// Refresh every 60 seconds
setInterval(fetchCryptos, 60000);
