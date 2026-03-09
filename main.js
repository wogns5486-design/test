const cryptoContainer = document.getElementById('crypto-container');
const themeToggle = document.getElementById('theme-toggle');
const langToggle = document.getElementById('lang-toggle');
const currencyToggle = document.getElementById('currency-toggle');
const searchInput = document.getElementById('crypto-search');
const tickerContent = document.getElementById('ticker-content');
const body = document.body;

let allCryptos = [];
let currentLang = localStorage.getItem('lang') || 'en';
let currentCurrency = localStorage.getItem('currency') || 'usd';
let currentCategory = 'all';

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
        hTrend: "7D Trend",
        hPrice: "Price (24h)",
        loading: "Loading data...",
        langBtn: "한국어",
        tickerPrefix: "LATEST NEWS: ",
        news: [
            "Bitcoin ETFs see record inflows as institutions accumulate.",
            "Solana ecosystem grows with new liquid staking protocols.",
            "AI-themed tokens surge amid NVIDIA's quarterly earnings.",
            "Ethereum's Dencun upgrade successfully reduces L2 fees."
        ]
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
        hTrend: "7일 추세",
        hPrice: "가격 (24h 변동)",
        loading: "데이터 로딩 중...",
        langBtn: "English",
        tickerPrefix: "주요 뉴스: ",
        news: [
            "비트코인 현물 ETF, 기관들의 대규모 매수세 유입 지속.",
            "솔라나 생태계, 신규 유동성 스테이킹 프로토콜로 성장세.",
            "엔비디아 실적 발표 후 AI 관련 가상자산 동반 급등.",
            "이더리움 덴쿤 업그레이드로 레이어2 수수료 대폭 절감."
        ]
    }
};

const coinCategories = {
    'layer-1': ['bitcoin', 'ethereum', 'solana', 'cardano', 'ripple', 'polkadot', 'avalanche-2', 'near', 'kaspa'],
    'ai': ['near', 'render-token', 'the-graph', 'bittensor', 'fetch-ai', 'singularitynet', 'akash-network'],
    'meme': ['dogecoin', 'shiba-inu', 'pepe', 'dogwifhat', 'bonk', 'floki'],
    'stablecoin': ['tether', 'usd-coin', 'dai', 'first-digital-usd', 'ethena-usde']
};

const coinSummaries = {
    en: {
        bitcoin: "Decentralized digital currency, the gold standard of crypto.",
        ethereum: "The leading smart contract platform for DeFi and DApps.",
        tether: "The most widely used USD-pegged stablecoin.",
        solana: "High-speed L1 blockchain optimized for scalability.",
        ripple: "Institutional payment network for cross-border liquidity.",
        near: "AI-forward L1 blockchain focusing on user usability.",
        'render-token': "Decentralized GPU rendering network for AI and 3D.",
        dogecoin: "The original meme asset, now a global payment tool."
    },
    ko: {
        bitcoin: "가상자산의 기축통화 역할을 하는 탈중앙화 디지털 자산.",
        ethereum: "DeFi와 DApp 생태계를 주도하는 스마트 컨트랙트 플랫폼.",
        tether: "가장 널리 사용되는 달러 연동형 스테이블코인.",
        solana: "확장성과 속도에 최적화된 고성능 레이어1 블록체인.",
        ripple: "금융기관용 실시간 국가 간 결제 네트워크.",
        near: "AI 기술 융합을 지향하는 사용자 친화적 블록체인.",
        'render-token': "AI 및 3D 렌더링을 위한 분산형 GPU 컴퓨팅 네트워크.",
        dogecoin: "강력한 커뮤니티를 보유한 가상자산 시장의 대표 밈 코인."
    }
};

function updateLanguage() {
    const t = translations[currentLang];
    document.title = t.siteTitle + " Dashboard";
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
    document.getElementById('h-trend').textContent = t.hTrend;
    document.getElementById('h-price').textContent = t.hPrice;
    langToggle.textContent = t.langBtn;
    
    // Update News Ticker
    tickerContent.innerHTML = t.news.map(n => `<span>• ${n}</span>`).join('&nbsp;&nbsp;&nbsp;&nbsp;');
    
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
        document.getElementById('sentiment-status').textContent = classification;
        if (value > 70) indexEl.style.color = 'var(--up-color)';
        else if (value < 30) indexEl.style.color = 'var(--down-color)';
        else indexEl.style.color = 'var(--accent-color)';
    } catch (err) {}
}

async function fetchCryptos() {
    try {
        const currency = currentCurrency.toUpperCase();
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currentCurrency}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h`);
        allCryptos = await response.json();
        renderCryptos(allCryptos);
    } catch (error) {
        cryptoContainer.innerHTML = `<p>${translations[currentLang].loading}</p>`;
    }
}

function renderCryptos(data) {
    cryptoContainer.innerHTML = '';
    const searchTerm = searchInput.value.toLowerCase();
    
    let filtered = data.filter(c => 
        c.name.toLowerCase().includes(searchTerm) || 
        c.symbol.toLowerCase().includes(searchTerm)
    );

    if (currentCategory !== 'all') {
        filtered = filtered.filter(c => coinCategories[currentCategory].includes(c.id));
    }

    filtered.forEach((crypto) => {
        const row = document.createElement('div');
        row.classList.add('crypto-row');

        const change = crypto.price_change_percentage_24h || 0;
        const changeClass = change >= 0 ? 'up' : 'down';
        const changeSymbol = change >= 0 ? '▲' : '▼';
        
        const summary = coinSummaries[currentLang][crypto.id] || 
                        (currentLang === 'en' ? "Leading project in its sector with significant market adoption." : "해당 분야에서 높은 시장 점유율을 보유한 주요 프로젝트입니다.");

        const currencySymbol = currentCurrency === 'usd' ? '$' : '₩';

        row.innerHTML = `
            <span class="crypto-rank">${crypto.market_cap_rank}</span>
            <div class="crypto-info">
                <span class="crypto-name">${crypto.name}</span>
                <span class="crypto-symbol">${crypto.symbol.toUpperCase()}</span>
            </div>
            <div class="crypto-desc">${summary}</div>
            <div class="crypto-trend">
                <img src="https://www.coingecko.com/coins/${crypto.image.split('/')[5]}/sparkline.svg" alt="trend" loading="lazy">
            </div>
            <div class="crypto-price-container">
                <p class="crypto-price">${currencySymbol}${crypto.current_price.toLocaleString()}</p>
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

currencyToggle.addEventListener('click', () => {
    currentCurrency = currentCurrency === 'usd' ? 'krw' : 'usd';
    localStorage.setItem('currency', currentCurrency);
    fetchCryptos();
});

searchInput.addEventListener('input', () => renderCryptos(allCryptos));

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        e.target.classList.add('active');
        currentCategory = e.target.dataset.category;
        renderCryptos(allCryptos);
    });
});

// Init
if (localStorage.getItem('theme') === 'dark') body.classList.add('dark-mode');
updateLanguage();
fetchFearAndGreed();
fetchCryptos();
setInterval(fetchCryptos, 60000);
