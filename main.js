const cryptoContainer = document.getElementById('crypto-container');
const themeToggle = document.getElementById('theme-toggle');
const langToggle = document.getElementById('lang-toggle');
const searchInput = document.getElementById('crypto-search');
const body = document.body;

let allCryptos = [];
let currentLang = localStorage.getItem('lang') || 'en';

// Translations
const translations = {
    en: {
        siteTitle: "Crypto Intelligence",
        themeDark: "Dark",
        themeLight: "Light",
        exchangeTitle: "Global Exchanges",
        contactTitle: "Partnership & Inquiries",
        labelName: "Name",
        labelEmail: "Email",
        labelMessage: "Message",
        submitBtn: "Send",
        commentsTitle: "Community Discussion",
        footerText: "© 2024 Crypto Intelligence Platform",
        sentimentLabel: "Market Sentiment",
        searchPlaceholder: "Search coins (e.g. BTC, ETH)",
        hName: "Name",
        hDesc: "Summary",
        hPrice: "Price (24h)",
        loading: "Loading data...",
        langBtn: "한국어"
    },
    ko: {
        siteTitle: "크립토 인텔리전스",
        themeDark: "다크",
        themeLight: "라이트",
        exchangeTitle: "글로벌 거래소",
        contactTitle: "제휴 및 문의",
        labelName: "이름",
        labelEmail: "이메일",
        labelMessage: "내용",
        submitBtn: "보내기",
        commentsTitle: "커뮤니티 토론",
        footerText: "© 2024 크립토 인텔리전스 플랫폼",
        sentimentLabel: "시장 심리 지수",
        searchPlaceholder: "코인 검색 (예: BTC, ETH)",
        hName: "자산명",
        hDesc: "프로젝트 요약",
        hPrice: "가격 (24h 변동)",
        loading: "데이터 로딩 중...",
        langBtn: "English"
    }
};

const coinSummaries = {
    en: {
        bitcoin: "Decentralized digital currency, the first and largest blockchain network.",
        ethereum: "Smart contract platform powering DeFi and Web3 applications.",
        tether: "Stablecoin pegged to the USD for liquidity and stability.",
        binancecoin: "Utility token for the Binance exchange and BSC ecosystem.",
        solana: "Ultra-fast blockchain for scalable DApps and NFTs.",
        ripple: "Global payment network for instant cross-border transfers.",
        usd_coin: "Fully regulated and transparent digital dollar stablecoin.",
        staked_ether: "Liquid representation of staked ETH in Proof-of-Stake.",
        dogecoin: "Community-driven meme coin turned digital payment asset.",
        cardano: "Scientific-led blockchain for secure and scalable smart contracts."
    },
    ko: {
        bitcoin: "중앙화된 통제를 벗어난 최초이자 최대의 디지털 자산 및 네트워크.",
        ethereum: "DeFi와 Web3 생태계의 기반이 되는 스마트 컨트랙트 플랫폼.",
        tether: "유동성과 안정성을 위해 미국 달러와 1:1로 가치가 고정된 스테이블코인.",
        binancecoin: "바이낸스 거래소와 BSC 생태계의 핵심 유틸리티 토큰.",
        solana: "DApp과 NFT를 위한 초고속 및 고확장성 블록체인 플랫폼.",
        ripple: "신속하고 저렴한 국가 간 송금을 위한 디지털 결제 네트워크.",
        usd_coin: "규제 승인을 받은 투명하고 안전한 법정화폐 담보형 스테이블코인.",
        staked_ether: "PoS 전환 이후 스테이킹된 이더리움을 나타내는 유동성 자산.",
        dogecoin: "강력한 커뮤니티 지지를 바탕으로 결제 수단이 된 밈 기반 자산.",
        cardano: "보안성과 확장성을 강조한 과학적 설계 기반의 블록체인 플랫폼."
    }
};

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
    document.getElementById('sentiment-label').textContent = t.sentimentLabel;
    document.getElementById('crypto-search').placeholder = t.searchPlaceholder;
    document.getElementById('h-name').textContent = t.hName;
    document.getElementById('h-desc').textContent = t.hDesc;
    document.getElementById('h-price').textContent = t.hPrice;
    langToggle.textContent = t.langBtn;
    
    renderCryptos(allCryptos);
}

async function fetchFearAndGreed() {
    try {
        const res = await fetch('https://api.alternative.me/fng/');
        const data = await res.json();
        const value = data.data[0].value;
        const classification = data.data[0].value_classification;
        
        const indexEl = document.getElementById('fear-greed-index');
        indexEl.textContent = value;
        
        const statusEl = document.getElementById('sentiment-status');
        statusEl.textContent = classification;
        
        // Color coding
        if (value > 70) indexEl.style.color = '#03a66d';
        else if (value < 30) indexEl.style.color = '#cf304a';
        else indexEl.style.color = '#f0b90b';
    } catch (err) {
        console.error("F&G Index error", err);
    }
}

async function fetchCryptos() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
        allCryptos = await response.json();
        renderCryptos(allCryptos);
    } catch (error) {
        console.error('Fetch error:', error);
        cryptoContainer.innerHTML = `<p>${translations[currentLang].loading}</p>`;
    }
}

function renderCryptos(data) {
    cryptoContainer.innerHTML = '';
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = data.filter(c => 
        c.name.toLowerCase().includes(searchTerm) || 
        c.symbol.toLowerCase().includes(searchTerm)
    );

    filtered.forEach((crypto, index) => {
        const row = document.createElement('div');
        row.classList.add('crypto-row');

        const change = crypto.price_change_percentage_24h || 0;
        const changeClass = change >= 0 ? 'up' : 'down';
        const changeSymbol = change >= 0 ? '▲' : '▼';
        
        const summary = coinSummaries[currentLang][crypto.id] || 
                        (currentLang === 'en' ? "Major digital asset facilitating innovation in the blockchain sector." : "블록체인 기술 혁신을 주도하는 주요 디지털 자산입니다.");

        row.innerHTML = `
            <span class="crypto-rank">${crypto.market_cap_rank}</span>
            <div class="crypto-info">
                <span class="crypto-name">${crypto.name}</span>
                <span class="crypto-symbol">${crypto.symbol.toUpperCase()}</span>
            </div>
            <div class="crypto-desc">${summary}</div>
            <div class="crypto-price-container">
                <p class="crypto-price">$${crypto.current_price.toLocaleString()}</p>
                <span class="crypto-change ${changeClass}">${changeSymbol} ${Math.abs(change).toFixed(2)}%</span>
            </div>
        `;
        cryptoContainer.appendChild(row);
    });
}

// Events
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
});

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ko' : 'en';
    localStorage.setItem('lang', currentLang);
    updateLanguage();
});

searchInput.addEventListener('input', () => renderCryptos(allCryptos));

// Initial Load
if (localStorage.getItem('theme') === 'dark') body.classList.add('dark-mode');
updateLanguage();
fetchFearAndGreed();
fetchCryptos();
setInterval(fetchCryptos, 60000);
setInterval(fetchFearAndGreed, 3600000); // 1 hour
