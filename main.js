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
let currentPage = 1;
const COINS_PER_PAGE = 20;
let lastFngValue = null;

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
        footerText: "© 2026 Crypto Intelligence Platform",
        sentimentLabel: "Market Sentiment",
        searchPlaceholder: "Search coins (e.g. BTC, ETH)",
        hName: "Name",
        hDesc: "Summary",
        hTrend: "7D Trend",
        hPrice: "Price (24h)",
        loading: "Loading data...",
        langBtn: "한국어",
        statMarketCap: "Market Cap",
        statVolume: "24h Volume",
        statBtcDom: "BTC Dom",
        statEthDom: "ETH Dom",
        statCoins: "Active Coins",
        portfolioTitle: "Portfolio Tracker",
        portfolioPlaceholder: "Select a coin...",
        portfolioAdd: "Add",
        portfolioTotal: "Total Value",
        portfolioEmpty: "No holdings yet. Add a coin above.",
        introTitle: "Your Free Crypto Intelligence Hub",
        introDesc: "Real-time prices, market sentiment, and news for the top 100 cryptocurrencies — all in one place. Track your portfolio, explore interactive charts, and stay ahead of the market.",
        news: [
            "Bitcoin ETFs see record inflows as institutions accumulate.",
            "Solana ecosystem grows with new liquid staking protocols.",
            "AI-themed tokens surge amid NVIDIA's quarterly earnings.",
            "Ethereum's Dencun upgrade successfully reduces L2 fees.",
            "Crypto market cap surpasses $3 trillion amid bull run.",
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
        footerText: "© 2026 크립토 인텔리전스 플랫폼",
        sentimentLabel: "시장 심리 지수",
        searchPlaceholder: "코인 검색 (예: BTC, ETH)",
        hName: "자산명",
        hDesc: "프로젝트 요약",
        hTrend: "7일 추세",
        hPrice: "가격 (24h 변동)",
        loading: "데이터 로딩 중...",
        langBtn: "English",
        statMarketCap: "시가총액",
        statVolume: "24h 거래량",
        statBtcDom: "BTC 점유율",
        statEthDom: "ETH 점유율",
        statCoins: "활성 코인",
        portfolioTitle: "포트폴리오 트래커",
        portfolioPlaceholder: "코인 선택...",
        portfolioAdd: "추가",
        portfolioTotal: "총 자산",
        portfolioEmpty: "보유 코인이 없습니다. 위에서 추가하세요.",
        introTitle: "무료 크립토 인텔리전스 허브",
        introDesc: "상위 100개 암호화폐의 실시간 가격, 시장 심리, 뉴스를 한곳에서. 포트폴리오를 추적하고 인터랙티브 차트로 시장을 분석하세요.",
        news: [
            "비트코인 현물 ETF, 기관들의 대규모 매수세 유입 지속.",
            "솔라나 생태계, 신규 유동성 스테이킹 프로토콜로 성장세.",
            "엔비디아 실적 발표 후 AI 관련 가상자산 동반 급등.",
            "이더리움 덴쿤 업그레이드로 레이어2 수수료 대폭 절감.",
            "가상자산 시가총액 3조 달러 돌파, 상승장 지속.",
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
        // Layer 1 & Major Assets
        bitcoin: "Decentralized digital currency, the gold standard of crypto.",
        ethereum: "The leading smart contract platform for DeFi and DApps.",
        solana: "High-speed L1 blockchain optimized for scalability.",
        ripple: "Institutional payment network for cross-border liquidity.",
        cardano: "Research-driven L1 blockchain with a proof-of-stake consensus.",
        'avalanche-2': "Fast, low-cost L1 with subnet architecture for scalability.",
        polkadot: "Multi-chain network enabling blockchain interoperability.",
        near: "AI-forward L1 blockchain focusing on user usability.",
        kaspa: "Ultra-fast proof-of-work blockchain using blockDAG technology.",
        aptos: "High-performance L1 built with Move language for safety.",
        sui: "Object-based L1 blockchain focused on speed and developer UX.",
        tron: "High-throughput blockchain for digital content and stablecoins.",
        stellar: "Open network for fast, low-cost cross-border payments.",
        cosmos: "Internet of blockchains enabling cross-chain communication.",
        'internet-computer': "Decentralized cloud computing platform by DFINITY.",
        algorand: "Carbon-negative L1 with pure proof-of-stake consensus.",
        'hedera-hashgraph': "Enterprise-grade public ledger using hashgraph consensus.",
        'ethereum-classic': "The original Ethereum chain preserving immutability.",
        litecoin: "Peer-to-peer digital currency, faster and lighter than Bitcoin.",
        'bitcoin-cash': "Bitcoin fork focused on fast, low-fee everyday payments.",
        eos: "High-performance blockchain for scalable decentralized apps.",
        neo: "Chinese smart contract platform for a smart economy.",
        iota: "Feeless distributed ledger designed for the Internet of Things.",
        vechain: "Supply chain and enterprise blockchain with dual-token model.",
        filecoin: "Decentralized storage network incentivizing data providers.",
        stacks: "Bitcoin L2 enabling smart contracts secured by Bitcoin.",
        flow: "L1 blockchain built for NFTs, gaming, and consumer apps.",
        'theta-network': "Decentralized video delivery and edge computing network.",
        harmony: "Fast and open blockchain for decentralized applications.",
        zilliqa: "High-throughput blockchain using sharding technology.",
        kava: "DeFi platform combining Cosmos and Ethereum ecosystems.",
        celo: "Mobile-first blockchain focused on financial inclusion.",
        waves: "Blockchain platform for creating custom tokens and dApps.",
        icon: "Korean interoperability blockchain connecting real-world institutions.",
        ontology: "High-performance public blockchain for identity and data.",
        'nervos-network': "Layered blockchain network for universal interoperability.",
        celestia: "Modular blockchain network separating consensus from execution.",
        mantle: "Ethereum L2 with modular data availability architecture.",
        'sei-network': "High-performance L1 optimized for trading applications.",
        // Stablecoins & Tokenized Assets
        tether: "The most widely used USD-pegged stablecoin.",
        'usd-coin': "Regulated, fully-reserved USD stablecoin by Circle.",
        dai: "Decentralized, crypto-collateralized stablecoin by MakerDAO.",
        'first-digital-usd': "Regulated fiat-backed stablecoin from Hong Kong.",
        'ethena-usde': "Synthetic dollar stablecoin backed by delta-neutral positions.",
        usds: "Decentralized stablecoin rebranded from DAI by Sky Protocol.",
        'paypal-usd': "USD stablecoin issued by PayPal for digital payments.",
        'tether-gold': "Gold-backed stablecoin with each token representing one troy ounce.",
        'pax-gold': "Regulated gold-backed token redeemable for physical gold.",
        'ripple-usd': "USD stablecoin issued by Ripple for cross-border settlements.",
        'true-usd': "Independently verified, fully-collateralized USD stablecoin.",
        'usdd': "Decentralized overcollateralized stablecoin on the TRON network.",
        'usd1-wlfi': "USD stablecoin issued by World Liberty Financial.",
        'falcon-finance': "Yield-bearing synthetic USD stablecoin by Falcon Finance.",
        'global-dollar': "Institutional-grade USD stablecoin by Paxos.",
        'usual-usd': "Decentralized stablecoin distributing protocol revenues to holders.",
        gho: "Decentralized stablecoin minted against collateral on Aave.",
        'ondo-us-dollar-yield': "Tokenized US Treasury yield product by Ondo Finance.",
        'hashnote-usyc': "Tokenized short-duration US Treasury fund by Hashnote.",
        'bfusd': "Yield-bearing USD stablecoin offered by Binance.",
        usdtb: "USD stablecoin backed by BlackRock BUIDL fund assets.",
        ousg: "Tokenized short-term US government bond fund by Ondo Finance.",
        // DeFi
        uniswap: "Leading decentralized exchange using automated market makers.",
        aave: "Decentralized lending and borrowing protocol on Ethereum.",
        maker: "Decentralized protocol governing the DAI stablecoin.",
        'curve-dao-token': "DEX optimized for stablecoin and pegged asset swaps.",
        'lido-dao': "Largest liquid staking protocol for ETH and other assets.",
        'pancakeswap-token': "Leading DEX and yield farming platform on BNB Chain.",
        'injective-protocol': "DeFi-focused L1 blockchain for derivatives and prediction markets.",
        'jupiter-exchange-solana': "Leading DEX aggregator and liquidity hub on Solana.",
        'jito-governance-token': "Liquid staking and MEV rewards protocol on Solana.",
        arbitrum: "Leading Ethereum L2 using optimistic rollup technology.",
        optimism: "Ethereum L2 scaling solution using optimistic rollups.",
        'polygon-ecosystem-token': "Ethereum L2 scaling token rebranded from MATIC to POL.",
        ethena: "Protocol issuing USDe, a synthetic dollar backed by delta-neutral positions.",
        morpho: "Decentralized lending protocol optimizing Aave and Compound rates.",
        sky: "Rebranded MakerDAO ecosystem governing USDS and SKY tokens.",
        'ondo-finance': "Platform tokenizing real-world assets like US Treasuries for DeFi.",
        // Exchange Tokens
        binancecoin: "Native token of Binance, the world's largest crypto exchange.",
        'leo-token': "Utility token of Bitfinex and iFinex ecosystem.",
        okb: "Utility and governance token of OKX exchange.",
        'bitget-token': "Native utility token of Bitget derivatives exchange.",
        'gatechain-token': "Utility token of Gate.io, a major global crypto exchange.",
        'kucoin-shares': "Native utility and profit-sharing token of KuCoin exchange.",
        'htx-dao': "Community governance token of the HTX (Huobi) exchange ecosystem.",
        hyperliquid: "High-performance on-chain perpetuals DEX with its own L1 blockchain.",
        nexo: "Crypto lending platform offering interest on digital asset deposits.",
        // AI & Data
        'render-token': "Decentralized GPU rendering network for AI and 3D.",
        bittensor: "Decentralized machine learning network rewarding AI models.",
        'fetch-ai': "Autonomous AI agents for automating complex tasks on-chain.",
        singularitynet: "Decentralized marketplace for AI services and algorithms.",
        'akash-network': "Decentralized cloud computing marketplace for GPU/CPU.",
        'the-graph': "Indexing protocol for querying blockchain data via GraphQL.",
        'ocean-protocol': "Data marketplace enabling monetization of AI training data.",
        'worldcoin-wld': "Global identity and financial network using iris biometrics.",
        'pyth-network': "High-fidelity real-time oracle network for DeFi data feeds.",
        'pump-fun': "Solana-based launchpad for instant meme coin creation and trading.",
        // Meme & Community Coins
        dogecoin: "The original meme asset, now a global payment tool.",
        'shiba-inu': "Dogecoin rival with its own DeFi and NFT ecosystem.",
        pepe: "Frog-themed meme coin with massive viral community following.",
        dogwifhat: "Solana-native dog-themed meme coin with cult following.",
        bonk: "Community-driven meme coin native to the Solana ecosystem.",
        floki: "Meme coin inspired by Elon Musk's dog with utility features.",
        'official-trump': "Meme coin launched by Donald Trump ahead of his inauguration.",
        memecore: "Community-driven meme chain built for on-chain meme culture.",
        // Wrapped Assets
        'wrapped-bitcoin': "ERC-20 token backed 1:1 by Bitcoin for use in DeFi.",
        // Other Notable Projects
        chainlink: "Decentralized oracle network connecting blockchains to real-world data.",
        monero: "Privacy-focused cryptocurrency with untraceable transactions.",
        'quant-network': "Interoperability layer connecting blockchains via the Overledger OS.",
        'immutable-x': "Ethereum L2 built specifically for NFT trading at zero gas fees.",
        decentraland: "Virtual reality world where users own and trade digital land.",
        'the-sandbox': "Play-to-earn metaverse where players create and monetize games.",
        'axie-infinity': "Play-to-earn NFT game with a player-owned economy.",
        helium: "Decentralized wireless network rewarding hotspot operators.",
        'woo-network': "Zero-fee trading platform powered by deep institutional liquidity.",
        loopring: "Ethereum L2 DEX using zkRollup for fast, cheap trading.",
        ankr: "Decentralized Web3 infrastructure and staking service provider.",
        storj: "Decentralized cloud storage with end-to-end encryption.",
        'band-protocol': "Cross-chain data oracle platform for real-world data feeds.",
        gala: "Gaming blockchain platform with player-owned assets and tokens.",
        wormhole: "Cross-chain messaging protocol connecting major blockchain networks.",
        notcoin: "Viral Telegram-based tap-to-earn game token on TON blockchain.",
        'the-open-network': "Layer 1 blockchain integrated into Telegram's messaging ecosystem.",
        'crypto-com-chain': "Native token of Crypto.com exchange and Cronos blockchain.",
        'pi-network': "Mobile-mined cryptocurrency with a massive global user base.",
        'flare-networks': "EVM-compatible L1 bringing smart contracts to XRP and other assets.",
        zcash: "Privacy-focused cryptocurrency with optional shielded transactions.",
        decred: "Hybrid PoW/PoS blockchain with strong on-chain governance.",
        'xdce-crowd-sale': "Enterprise blockchain platform for trade finance and payments.",
        'canton-network': "Privacy-enabled blockchain network for institutional finance.",
        'figure-heloc': "Blockchain-based home equity line of credit platform.",
        whitebit: "Native token of WhiteBIT, a European centralized exchange.",
        'world-liberty-financial': "DeFi protocol affiliated with the Trump family.",
        'blackrock-usd-institutional-digital-liquidity-fund': "BlackRock's tokenized USD money market fund on blockchain.",
        'flare-networks': "EVM-compatible L1 bringing smart contracts to non-smart-contract assets.",
        rain: "Regulated crypto exchange platform serving the Middle East.",
        'aster-2': "Community-driven blockchain project with yield-generating mechanisms.",
        'superstate-short-duration-us-government-securities-fund-ustb': "Superstate's tokenized short-duration US government securities fund.",
        eutbl: "Spiko's tokenized EU T-Bills money market fund on blockchain.",
        'midnight-3': "Privacy-focused sidechain built on the Cardano ecosystem.",
        'hash-2': "Provenance Blockchain native token for financial services.",
        'janus-henderson-anemoy-aaa-clo-fund': "Janus Henderson's tokenized AAA-rated CLO fund on blockchain.",
        'stable-2': "Decentralized stablecoin protocol focused on capital efficiency.",
        beldex: "Privacy blockchain with anonymous messaging and DeFi features.",
        ylds: "Yield-generating tokenized US Treasury product by Figure.",
        'janus-henderson-anemoy-treasury-fund': "Janus Henderson's tokenized treasury fund for institutional investors.",
        'kite-2': "Community token powering decentralized finance applications.",
        a7a5: "Emerging blockchain project with community-driven governance.",
    },
    ko: {
        // Layer 1 & Major Assets
        bitcoin: "가상자산의 기축통화 역할을 하는 탈중앙화 디지털 자산.",
        ethereum: "DeFi와 DApp 생태계를 주도하는 스마트 컨트랙트 플랫폼.",
        solana: "확장성과 속도에 최적화된 고성능 레이어1 블록체인.",
        ripple: "금융기관용 실시간 국가 간 결제 네트워크.",
        cardano: "학술 연구 기반의 지분 증명 레이어1 블록체인.",
        'avalanche-2': "서브넷 아키텍처로 확장성을 갖춘 고속 레이어1 블록체인.",
        polkadot: "블록체인 간 상호운용성을 지원하는 멀티체인 네트워크.",
        near: "AI 기술 융합을 지향하는 사용자 친화적 블록체인.",
        kaspa: "블록DAG 기술을 활용한 초고속 작업 증명 블록체인.",
        aptos: "안전성을 위해 Move 언어로 구축된 고성능 레이어1.",
        sui: "속도와 개발자 경험에 초점을 맞춘 객체 기반 레이어1 블록체인.",
        tron: "디지털 콘텐츠와 스테이블코인에 특화된 고처리량 블록체인.",
        stellar: "빠르고 저렴한 국가 간 송금을 위한 개방형 네트워크.",
        cosmos: "크로스체인 통신을 지원하는 블록체인 인터넷 생태계.",
        'internet-computer': "DFINITY가 개발한 탈중앙화 클라우드 컴퓨팅 플랫폼.",
        algorand: "순수 지분 증명 방식의 탄소 중립 레이어1 블록체인.",
        'hedera-hashgraph': "해시그래프 합의를 사용하는 기업용 퍼블릭 원장.",
        'ethereum-classic': "불변성을 지키는 이더리움 오리지널 체인.",
        litecoin: "비트코인보다 빠르고 가벼운 P2P 디지털 화폐.",
        'bitcoin-cash': "빠르고 저렴한 일상 결제에 특화된 비트코인 포크.",
        eos: "확장 가능한 탈중앙화 앱을 위한 고성능 블록체인.",
        neo: "스마트 이코노미를 위한 중국의 스마트 컨트랙트 플랫폼.",
        iota: "사물인터넷을 위해 설계된 수수료 없는 분산 원장.",
        vechain: "이중 토큰 모델의 공급망 및 기업용 블록체인.",
        filecoin: "데이터 제공자에게 보상하는 탈중앙화 스토리지 네트워크.",
        stacks: "비트코인으로 보안되는 스마트 컨트랙트를 지원하는 레이어2.",
        flow: "NFT, 게임, 소비자 앱을 위해 설계된 레이어1 블록체인.",
        'theta-network': "탈중앙화 동영상 전송 및 엣지 컴퓨팅 네트워크.",
        harmony: "탈중앙화 애플리케이션을 위한 빠르고 개방된 블록체인.",
        zilliqa: "샤딩 기술을 사용하는 고처리량 블록체인.",
        kava: "코스모스와 이더리움 생태계를 결합한 DeFi 플랫폼.",
        celo: "금융 포용을 위한 모바일 우선 블록체인.",
        waves: "커스텀 토큰 및 dApp 생성을 위한 블록체인 플랫폼.",
        icon: "현실 기관을 연결하는 한국의 상호운용성 블록체인.",
        ontology: "신원 및 데이터를 위한 고성능 퍼블릭 블록체인.",
        'nervos-network': "범용 상호운용성을 위한 레이어드 블록체인 네트워크.",
        celestia: "합의와 실행을 분리하는 모듈형 블록체인 네트워크.",
        mantle: "모듈형 데이터 가용성 아키텍처를 갖춘 이더리움 레이어2.",
        'sei-network': "트레이딩 애플리케이션에 최적화된 고성능 레이어1.",
        // Stablecoins & Tokenized Assets
        tether: "가장 널리 사용되는 달러 연동형 스테이블코인.",
        'usd-coin': "Circle이 발행하는 규제 준수 완전 준비금 USD 스테이블코인.",
        dai: "MakerDAO의 탈중앙화 암호화폐 담보 스테이블코인.",
        'first-digital-usd': "홍콩에서 발행되는 규제 준수 법정화폐 담보 스테이블코인.",
        'ethena-usde': "델타 중립 포지션으로 담보된 합성 달러 스테이블코인.",
        usds: "Sky Protocol이 DAI에서 리브랜딩한 탈중앙화 스테이블코인.",
        'paypal-usd': "PayPal이 발행하는 디지털 결제용 USD 스테이블코인.",
        'tether-gold': "1트로이온스 금과 연동된 테더 발행 금 담보 스테이블코인.",
        'pax-gold': "실물 금과 교환 가능한 규제 준수 금 담보 토큰.",
        'ripple-usd': "Ripple이 국가 간 결제를 위해 발행하는 USD 스테이블코인.",
        'true-usd': "독립 검증 방식의 완전 담보 USD 스테이블코인.",
        'usdd': "트론 네트워크의 탈중앙화 초과 담보 스테이블코인.",
        'usd1-wlfi': "World Liberty Financial이 발행하는 USD 스테이블코인.",
        'falcon-finance': "Falcon Finance의 수익 창출형 합성 USD 스테이블코인.",
        'global-dollar': "Paxos가 발행하는 기관급 USD 스테이블코인.",
        'usual-usd': "프로토콜 수익을 보유자에게 분배하는 탈중앙화 스테이블코인.",
        gho: "Aave 담보 기반으로 발행되는 탈중앙화 스테이블코인.",
        'ondo-us-dollar-yield': "Ondo Finance의 토큰화된 미국 국채 수익 상품.",
        'hashnote-usyc': "Hashnote의 토큰화된 단기 미국 국채 펀드.",
        'bfusd': "바이낸스가 제공하는 수익형 USD 스테이블코인.",
        usdtb: "블랙록 BUIDL 펀드 자산으로 담보된 USD 스테이블코인.",
        ousg: "Ondo Finance의 토큰화된 단기 미국 국채 펀드.",
        // DeFi
        uniswap: "자동화된 시장 조성자 방식의 대표적인 탈중앙화 거래소.",
        aave: "이더리움 기반 탈중앙화 대출 및 차입 프로토콜.",
        maker: "DAI 스테이블코인을 관리하는 탈중앙화 프로토콜.",
        'curve-dao-token': "스테이블코인 및 페그 자산 스왑에 최적화된 DEX.",
        'lido-dao': "ETH 및 기타 자산을 위한 최대 규모의 유동성 스테이킹 프로토콜.",
        'pancakeswap-token': "BNB 체인의 대표적인 DEX 및 수익 농사 플랫폼.",
        'injective-protocol': "파생상품 및 예측 시장에 특화된 DeFi 레이어1 블록체인.",
        'jupiter-exchange-solana': "솔라나의 대표 DEX 어그리게이터 및 유동성 허브.",
        'jito-governance-token': "솔라나의 유동성 스테이킹 및 MEV 보상 프로토콜.",
        arbitrum: "옵티미스틱 롤업 기술을 사용하는 대표적인 이더리움 레이어2.",
        optimism: "옵티미스틱 롤업 방식의 이더리움 레이어2 확장 솔루션.",
        'polygon-ecosystem-token': "MATIC에서 POL로 리브랜딩된 이더리움 레이어2 확장 토큰.",
        ethena: "델타 중립 포지션으로 담보된 합성 달러 USDe를 발행하는 프로토콜.",
        morpho: "Aave와 Compound 금리를 최적화하는 탈중앙화 대출 프로토콜.",
        sky: "USDS 및 SKY 토큰을 관리하는 리브랜딩된 MakerDAO 생태계.",
        'ondo-finance': "미국 국채 등 실물 자산을 DeFi용으로 토큰화하는 플랫폼.",
        // Exchange Tokens
        binancecoin: "세계 최대 암호화폐 거래소 바이낸스의 네이티브 토큰.",
        'leo-token': "Bitfinex 및 iFinex 생태계의 유틸리티 토큰.",
        okb: "OKX 거래소의 유틸리티 및 거버넌스 토큰.",
        'bitget-token': "비트겟 파생상품 거래소의 네이티브 유틸리티 토큰.",
        'gatechain-token': "글로벌 주요 암호화폐 거래소 Gate.io의 유틸리티 토큰.",
        'kucoin-shares': "KuCoin 거래소의 수익 공유 및 유틸리티 토큰.",
        'htx-dao': "HTX(구 후오비) 거래소 생태계의 커뮤니티 거버넌스 토큰.",
        hyperliquid: "자체 L1 블록체인을 보유한 고성능 온체인 무기한 선물 DEX.",
        nexo: "디지털 자산 예치 이자를 제공하는 크립토 대출 플랫폼.",
        // AI & Data
        'render-token': "AI 및 3D 렌더링을 위한 분산형 GPU 컴퓨팅 네트워크.",
        bittensor: "AI 모델에 보상을 제공하는 탈중앙화 머신러닝 네트워크.",
        'fetch-ai': "온체인 복잡한 작업 자동화를 위한 자율 AI 에이전트.",
        singularitynet: "AI 서비스와 알고리즘을 위한 탈중앙화 마켓플레이스.",
        'akash-network': "GPU/CPU를 위한 탈중앙화 클라우드 컴퓨팅 마켓플레이스.",
        'the-graph': "GraphQL로 블록체인 데이터를 조회하는 인덱싱 프로토콜.",
        'ocean-protocol': "AI 학습 데이터 수익화를 지원하는 데이터 마켓플레이스.",
        'worldcoin-wld': "홍채 생체인식을 활용한 글로벌 신원 및 금융 네트워크.",
        'pyth-network': "DeFi를 위한 고정밀 실시간 오라클 네트워크.",
        'pump-fun': "솔라나 기반 즉석 밈코인 생성 및 거래 론칭패드.",
        // Meme & Community Coins
        dogecoin: "강력한 커뮤니티를 보유한 가상자산 시장의 대표 밈 코인.",
        'shiba-inu': "자체 DeFi와 NFT 생태계를 갖춘 도지코인 라이벌.",
        pepe: "방대한 바이럴 커뮤니티를 보유한 개구리 테마 밈 코인.",
        dogwifhat: "솔라나 기반의 컬트적 팬덤을 가진 강아지 테마 밈 코인.",
        bonk: "솔라나 생태계 커뮤니티 주도 밈 코인.",
        floki: "일론 머스크의 반려견에서 영감을 받은 유틸리티 밈 코인.",
        'official-trump': "도널드 트럼프가 취임 전 출시한 정치 테마 밈 코인.",
        memecore: "온체인 밈 문화를 위해 구축된 커뮤니티 주도 밈 체인.",
        // Wrapped Assets
        'wrapped-bitcoin': "DeFi에서 사용하기 위해 비트코인과 1:1로 담보된 ERC-20 토큰.",
        // Other Notable Projects
        chainlink: "블록체인을 실세계 데이터와 연결하는 탈중앙화 오라클 네트워크.",
        monero: "추적 불가능한 거래를 지원하는 프라이버시 특화 암호화폐.",
        'quant-network': "Overledger OS를 통해 블록체인을 연결하는 상호운용성 레이어.",
        'immutable-x': "가스비 없는 NFT 거래를 위해 특화된 이더리움 레이어2.",
        decentraland: "사용자가 디지털 토지를 소유하고 거래하는 가상현실 세계.",
        'the-sandbox': "플레이어가 게임을 만들고 수익화하는 P2E 메타버스.",
        'axie-infinity': "플레이어 소유 경제를 갖춘 P2E NFT 게임.",
        helium: "핫스팟 운영자에게 보상하는 탈중앙화 무선 네트워크.",
        'woo-network': "기관 유동성 기반의 수수료 없는 트레이딩 플랫폼.",
        loopring: "zkRollup을 사용한 빠르고 저렴한 이더리움 레이어2 DEX.",
        ankr: "탈중앙화 Web3 인프라 및 스테이킹 서비스 제공업체.",
        storj: "엔드투엔드 암호화를 갖춘 탈중앙화 클라우드 스토리지.",
        'band-protocol': "실세계 데이터를 위한 크로스체인 데이터 오라클 플랫폼.",
        gala: "플레이어 소유 자산과 토큰을 갖춘 게임 블록체인 플랫폼.",
        wormhole: "주요 블록체인 네트워크를 연결하는 크로스체인 메시징 프로토콜.",
        notcoin: "TON 블록체인 기반의 텔레그램 탭투언 게임 토큰.",
        'the-open-network': "텔레그램 메신저 생태계와 통합된 레이어1 블록체인.",
        'crypto-com-chain': "Crypto.com 거래소 및 크로노스 블록체인의 네이티브 토큰.",
        'pi-network': "전 세계적으로 방대한 사용자 기반을 보유한 모바일 채굴 암호화폐.",
        'flare-networks': "XRP 등 스마트 컨트랙트 미지원 자산에 스마트 컨트랙트를 제공하는 EVM 호환 L1.",
        zcash: "선택적 실드 트랜잭션을 지원하는 프라이버시 특화 암호화폐.",
        decred: "강력한 온체인 거버넌스를 갖춘 하이브리드 PoW/PoS 블록체인.",
        'xdce-crowd-sale': "무역 금융 및 결제를 위한 기업용 블록체인 플랫폼.",
        'canton-network': "기관 금융을 위한 프라이버시 지원 블록체인 네트워크.",
        'figure-heloc': "블록체인 기반 주택 담보 신용 한도 플랫폼.",
        whitebit: "유럽 중앙화 거래소 WhiteBIT의 네이티브 토큰.",
        'world-liberty-financial': "트럼프 일가와 연관된 DeFi 프로토콜.",
        'blackrock-usd-institutional-digital-liquidity-fund': "블록체인에서 운용되는 블랙록의 토큰화된 달러 머니마켓 펀드.",
        rain: "중동 지역을 대상으로 하는 규제 준수 암호화폐 거래 플랫폼.",
        'aster-2': "수익 창출 메커니즘을 갖춘 커뮤니티 주도 블록체인 프로젝트.",
        'superstate-short-duration-us-government-securities-fund-ustb': "Superstate의 토큰화된 단기 미국 국채 펀드.",
        eutbl: "Spiko의 블록체인 기반 토큰화된 유럽 국채 머니마켓 펀드.",
        'midnight-3': "카르다노 생태계 기반의 프라이버시 특화 사이드체인.",
        'hash-2': "금융 서비스를 위한 Provenance 블록체인의 네이티브 토큰.",
        'janus-henderson-anemoy-aaa-clo-fund': "Janus Henderson의 블록체인 기반 AAA 등급 CLO 토큰화 펀드.",
        'stable-2': "자본 효율성에 중점을 둔 탈중앙화 스테이블코인 프로토콜.",
        beldex: "익명 메시징과 DeFi 기능을 갖춘 프라이버시 블록체인.",
        ylds: "Figure가 발행하는 수익형 토큰화 미국 국채 상품.",
        'janus-henderson-anemoy-treasury-fund': "기관 투자자를 위한 Janus Henderson의 토큰화된 국채 펀드.",
        'kite-2': "탈중앙화 금융 애플리케이션을 지원하는 커뮤니티 토큰.",
        a7a5: "커뮤니티 주도 거버넌스를 갖춘 신흥 블록체인 프로젝트.",
    }
};

function generateSummary(crypto, lang) {
    const rank = crypto.market_cap_rank;
    const symbol = crypto.symbol.toUpperCase();

    let categoryKey = null;
    for (const [cat, ids] of Object.entries(coinCategories)) {
        if (ids.includes(crypto.id)) { categoryKey = cat; break; }
    }

    const categoryNames = {
        en: { 'layer-1': 'Layer 1 blockchain', 'ai': 'AI-sector token', 'meme': 'meme coin', 'stablecoin': 'stablecoin' },
        ko: { 'layer-1': '레이어1 블록체인', 'ai': 'AI 분야 토큰', 'meme': '밈 코인', 'stablecoin': '스테이블코인' }
    };

    const catLabel = categoryKey
        ? categoryNames[lang][categoryKey]
        : (lang === 'en' ? 'digital asset' : '디지털 자산');

    return lang === 'en'
        ? `${symbol} is a ${catLabel} ranked #${rank} by global market cap.`
        : `${symbol}은 글로벌 시가총액 ${rank}위의 ${catLabel}입니다.`;
}

// ── Helper ──────────────────────────────────────────────
function formatLargeNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9)  return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6)  return (num / 1e6).toFixed(2) + 'M';
    return num.toLocaleString();
}

// ── 1. Global Market Stats ───────────────────────────────
async function fetchGlobalStats() {
    try {
        const res = await fetch('https://api.coingecko.com/api/v3/global');
        const { data: d } = await res.json();
        const t = translations[currentLang];
        const sym = currentCurrency === 'usd' ? '$' : '₩';
        const cap = d.total_market_cap[currentCurrency];
        const vol = d.total_volume[currentCurrency];
        const btc = d.market_cap_percentage.btc.toFixed(1);
        const eth = d.market_cap_percentage.eth.toFixed(1);
        const chg = d.market_cap_change_percentage_24h_usd.toFixed(2);
        const chgClass = chg >= 0 ? 'up' : 'down';
        document.getElementById('stat-marketcap').innerHTML =
            `${t.statMarketCap}: ${sym}${formatLargeNumber(cap)} <span class="${chgClass}">${chg >= 0 ? '▲' : '▼'}${Math.abs(chg)}%</span>`;
        document.getElementById('stat-volume').textContent  = `${t.statVolume}: ${sym}${formatLargeNumber(vol)}`;
        document.getElementById('stat-btc-dom').textContent = `${t.statBtcDom}: ${btc}%`;
        document.getElementById('stat-eth-dom').textContent = `${t.statEthDom}: ${eth}%`;
        document.getElementById('stat-coins').textContent   = `${t.statCoins}: ${d.active_cryptocurrencies.toLocaleString()}`;
    } catch(e) {}
}

// ── 2. Real-time News ────────────────────────────────────
async function fetchNews() {
    try {
        const url = 'https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss&count=20';
        const res  = await fetch(url);
        const data = await res.json();
        if (data.status === 'ok' && data.items.length) {
            tickerContent.innerHTML = data.items
                .map(item => `<span>• ${item.title}</span>`)
                .join('&nbsp;&nbsp;&nbsp;&nbsp;');
            return;
        }
    } catch(e) {}
    // Fallback to static headlines
    const t = translations[currentLang];
    tickerContent.innerHTML = t.news.map(n => `<span>• ${n}</span>`).join('&nbsp;&nbsp;&nbsp;&nbsp;');
}

// ── 3. Portfolio Tracker ─────────────────────────────────
let portfolio = JSON.parse(localStorage.getItem('portfolio') || '[]');

function savePortfolio() {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
}

function renderPortfolio() {
    const t = translations[currentLang];
    const list = document.getElementById('portfolio-list');
    const totalEl = document.getElementById('portfolio-total-value');
    const sym = currentCurrency === 'usd' ? '$' : '₩';

    document.getElementById('portfolio-title').textContent = t.portfolioTitle;
    document.getElementById('portfolio-add-btn').textContent = t.portfolioAdd;
    document.getElementById('portfolio-total-label').textContent = t.portfolioTotal + ':';
    document.getElementById('portfolio-coin-select').options[0].text = t.portfolioPlaceholder;

    if (portfolio.length === 0) {
        list.innerHTML = `<div id="portfolio-empty">${t.portfolioEmpty}</div>`;
        totalEl.textContent = `${sym}0.00`;
        return;
    }

    let total = 0;
    list.innerHTML = '';
    portfolio.forEach((item, idx) => {
        const coin = allCryptos.find(c => c.id === item.id);
        if (!coin) return;
        const value = coin.current_price * item.amount;
        const change = coin.price_change_percentage_24h || 0;
        total += value;
        const row = document.createElement('div');
        row.className = 'portfolio-item';
        row.innerHTML = `
            <span class="portfolio-item-name">${coin.name} <small style="color:var(--sub-text-color)">${coin.symbol.toUpperCase()}</small></span>
            <span class="portfolio-item-amount">${item.amount} ${coin.symbol.toUpperCase()}</span>
            <span class="portfolio-item-value">${sym}${value.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
            <span class="portfolio-item-change ${change >= 0 ? 'up' : 'down'}">${change >= 0 ? '▲' : '▼'}${Math.abs(change).toFixed(2)}%</span>
            <button class="portfolio-remove-btn" data-idx="${idx}">✕</button>
        `;
        list.appendChild(row);
    });
    totalEl.textContent = `${sym}${total.toLocaleString(undefined, {maximumFractionDigits: 2})}`;

    list.querySelectorAll('.portfolio-remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            portfolio.splice(parseInt(e.target.dataset.idx), 1);
            savePortfolio();
            renderPortfolio();
        });
    });
}

function populatePortfolioSelect() {
    const select = document.getElementById('portfolio-coin-select');
    const t = translations[currentLang];
    select.innerHTML = `<option value="">${t.portfolioPlaceholder}</option>`;
    allCryptos.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.name} (${c.symbol.toUpperCase()})`;
        select.appendChild(opt);
    });
}

document.getElementById('portfolio-add-btn').addEventListener('click', () => {
    const select = document.getElementById('portfolio-coin-select');
    const amountInput = document.getElementById('portfolio-amount');
    const id = select.value;
    const amount = parseFloat(amountInput.value);
    if (!id || !amount || amount <= 0) return;
    const existing = portfolio.find(p => p.id === id);
    if (existing) {
        existing.amount += amount;
    } else {
        portfolio.push({ id, amount });
    }
    savePortfolio();
    renderPortfolio();
    amountInput.value = '';
    select.value = '';
});

// ── 4. TradingView Chart Modal ───────────────────────────
function openChart(coin) {
    const modal = document.getElementById('chart-modal');
    const container = document.getElementById('tradingview-widget-container');
    document.getElementById('modal-coin-title').textContent = `${coin.name} (${coin.symbol.toUpperCase()})`;
    container.innerHTML = '';
    const isDark = !body.classList.contains('light-mode');
    const symbol = `BINANCE:${coin.symbol.toUpperCase()}USDT`;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.textContent = JSON.stringify({
        symbol,
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: isDark ? 'dark' : 'light',
        style: '1',
        locale: 'en',
        width: '100%',
        height: '500',
        allow_symbol_change: true,
        hide_side_toolbar: false,
    });
    container.appendChild(script);
    modal.classList.add('open');
}

document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('chart-modal').classList.remove('open');
    document.getElementById('tradingview-widget-container').innerHTML = '';
});
document.getElementById('chart-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        e.currentTarget.classList.remove('open');
        document.getElementById('tradingview-widget-container').innerHTML = '';
    }
});

// ────────────────────────────────────────────────────────
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
    document.getElementById('footer-text').textContent = t.footerText;
    document.getElementById('sentiment-label').textContent = t.sentimentLabel;
    document.getElementById('crypto-search').placeholder = t.searchPlaceholder;
    document.getElementById('h-name').textContent = t.hName;
    document.getElementById('h-desc').textContent = t.hDesc;
    document.getElementById('h-trend').textContent = t.hTrend;
    document.getElementById('h-price').textContent = t.hPrice;
    langToggle.textContent = t.langBtn;
    themeToggle.textContent = body.classList.contains('light-mode') ? t.themeDark : t.themeLight;
    document.getElementById('intro-title').textContent = t.introTitle;
    document.getElementById('intro-desc').textContent  = t.introDesc;
    fetchGlobalStats();
    renderCryptos(allCryptos);
    renderPortfolio();
    updateCategoryDesc(currentCategory);
    if (lastFngValue !== null) updateFngExplain(lastFngValue);
}

const fngExplainData = {
    en: [
        { max: 24, badge: 'Extreme Fear', title: '😱 Extreme Fear — Market is in Panic',
          text: 'The market is gripped by fear. Investors are selling aggressively and sentiment is at its most pessimistic. Extreme fear often appears near market bottoms, but can persist for extended periods in a bear market. Historically, this zone has offered the best long-term entry points — but catching a falling knife carries real risk.',
          tip: '💡 Investor insight: Warren Buffett\'s principle — "Be greedy when others are fearful" — applies here. However, extreme fear can intensify before it improves. Dollar-cost averaging rather than lump-sum buying is generally advisable.' },
        { max: 44, badge: 'Fear', title: '😰 Fear — Negative Sentiment Dominates',
          text: 'Market participants are cautious and selling pressure remains elevated. Prices may continue to fall, but the pace of decline is typically slower than in extreme fear. Many experienced investors begin watching for accumulation opportunities in this zone.',
          tip: '💡 Investor insight: Fear zones can present value opportunities, but patience is key. Monitor Bitcoin dominance — if BTC dominance is rising alongside fear, altcoins may face more downside pressure.' },
        { max: 55, badge: 'Neutral', title: '😐 Neutral — Market is Balanced',
          text: 'The market is in equilibrium between buyers and sellers. Neither panic nor euphoria is driving price action. Neutral readings often precede a directional move — the market is gathering momentum before its next significant trend.',
          tip: '💡 Investor insight: Neutral is a good time to review your portfolio allocation and ensure you\'re positioned for either outcome. Avoid making large directional bets based on short-term signals alone.' },
        { max: 74, badge: 'Greed', title: '🤑 Greed — Bulls Are in Control',
          text: 'Positive sentiment is pushing prices higher. Investors are buying confidently and market momentum is strong. Greed phases often persist longer than expected, but they also carry elevated risk as late buyers enter at increasingly high prices.',
          tip: '💡 Investor insight: Greed is not necessarily a sell signal, but it warrants caution. Consider taking partial profits on positions that have significantly appreciated. Avoid going all-in at this stage.' },
        { max: 100, badge: 'Extreme Greed', title: '🚀 Extreme Greed — Market is Overheated',
          text: 'The market is running on euphoria and FOMO (fear of missing out). Nearly everyone is bullish, media coverage is intense, and new retail investors are rushing in. Historically, extreme greed readings have preceded notable market corrections — sometimes sharply.',
          tip: '💡 Investor insight: "Be fearful when others are greedy." Extreme greed is a classic contrarian warning sign. This is typically not the time to make large new purchases. Focus on risk management and consider reducing exposure.' }
    ],
    ko: [
        { max: 24, badge: '극도의 공포', title: '😱 극도의 공포 — 시장이 패닉 상태',
          text: '시장이 공포에 휩싸여 있습니다. 투자자들이 공격적으로 매도하며 심리가 최악의 비관론에 빠진 상태입니다. 극도의 공포는 시장 바닥 근처에서 자주 나타나지만, 하락장에서는 장기간 지속될 수도 있습니다. 역사적으로 이 구간은 장기 최적 매수 시점을 제공했지만, 하락하는 칼날을 잡는 것은 실질적인 위험을 수반합니다.',
          tip: '💡 투자자 인사이트: 워렌 버핏의 원칙 — "남들이 두려워할 때 탐욕스러워져라" — 가 적용됩니다. 그러나 극도의 공포는 회복 전에 더 심해질 수 있습니다. 일괄 매수보다 분할 매수(DCA)가 일반적으로 권장됩니다.' },
        { max: 44, badge: '공포', title: '😰 공포 — 부정적 심리가 지배',
          text: '시장 참여자들이 신중하게 움직이며 매도 압력이 여전히 높습니다. 가격이 계속 하락할 수 있지만 속도는 극도의 공포보다 느린 편입니다. 경험 많은 투자자들이 이 구간에서 분할 매수 기회를 탐색하기 시작합니다.',
          tip: '💡 투자자 인사이트: 공포 구간은 가치 매수 기회를 제공하지만 인내가 중요합니다. 비트코인 점유율을 모니터링하세요 — BTC 점유율이 공포와 함께 상승하면 알트코인이 더 큰 하락 압력을 받을 수 있습니다.' },
        { max: 55, badge: '중립', title: '😐 중립 — 시장이 균형 상태',
          text: '시장이 매수자와 매도자 사이에서 균형을 이루고 있습니다. 공황도 열광도 가격을 주도하지 않습니다. 중립 수치는 다음 방향성 있는 움직임 전 모멘텀을 쌓는 단계인 경우가 많습니다.',
          tip: '💡 투자자 인사이트: 중립은 포트폴리오 배분을 점검하고 양방향 시나리오에 대비하기 좋은 시기입니다. 단기 신호만으로 큰 방향성 베팅은 피하세요.' },
        { max: 74, badge: '탐욕', title: '🤑 탐욕 — 강세장이 주도',
          text: '긍정적 심리가 가격을 밀어올리고 있습니다. 투자자들이 자신감 있게 매수하며 모멘텀이 강합니다. 탐욕 국면은 예상보다 오래 지속되는 경향이 있지만, 후발 매수자들이 점점 높은 가격에 진입하면서 위험도 높아집니다.',
          tip: '💡 투자자 인사이트: 탐욕이 반드시 매도 신호는 아니지만 주의가 필요합니다. 크게 오른 포지션의 일부 수익 실현을 고려하세요. 이 단계에서 전량 매수는 피하세요.' },
        { max: 100, badge: '극도의 탐욕', title: '🚀 극도의 탐욕 — 시장 과열',
          text: '시장이 열광과 FOMO(놓칠 것 같은 두려움)로 달아올랐습니다. 거의 모든 사람이 강세를 보이고, 미디어 노출이 폭증하며, 신규 개인 투자자들이 몰려들고 있습니다. 역사적으로 극도의 탐욕 수치 이후 상당한 조정이 뒤따른 경우가 많았습니다.',
          tip: '💡 투자자 인사이트: "남들이 탐욕스러울 때 두려워하라." 극도의 탐욕은 전형적인 역발상 경고 신호입니다. 일반적으로 대규모 신규 매수를 할 시기가 아닙니다. 리스크 관리에 집중하고 비중 축소를 고려하세요.' }
    ]
};

function updateFngExplain(value) {
    const lang = currentLang;
    const data = fngExplainData[lang];
    const entry = data.find(d => value <= d.max) || data[data.length - 1];
    document.getElementById('fng-explain-badge').textContent = entry.badge;
    document.getElementById('fng-explain-title').textContent = entry.title;
    document.getElementById('fng-explain-text').textContent = entry.text;
    document.getElementById('fng-explain-tip').textContent = entry.tip;
    // Move needle
    const pct = Math.min(Math.max(value, 0), 100);
    document.getElementById('fng-needle').style.left = pct + '%';
}

async function fetchFearAndGreed() {
    try {
        const res = await fetch('https://api.alternative.me/fng/');
        const data = await res.json();
        const value = parseInt(data.data[0].value);
        const classification = data.data[0].value_classification;
        const indexEl = document.getElementById('fear-greed-index');
        indexEl.textContent = value;
        document.getElementById('sentiment-status').textContent = classification;
        if (value > 70) indexEl.style.color = 'var(--up)';
        else if (value < 30) indexEl.style.color = 'var(--down)';
        else indexEl.style.color = 'var(--accent-2)';
        lastFngValue = value;
        updateFngExplain(value);
    } catch (err) {}
}

async function fetchCryptos() {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currentCurrency}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h`);
        allCryptos = await response.json();
        populatePortfolioSelect();
        renderCryptos(allCryptos);
        renderPortfolio();
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

    const totalPages = Math.max(1, Math.ceil(filtered.length / COINS_PER_PAGE));
    if (currentPage > totalPages) currentPage = 1;
    const paginated = filtered.slice((currentPage - 1) * COINS_PER_PAGE, currentPage * COINS_PER_PAGE);

    paginated.forEach((crypto) => {
        const row = document.createElement('div');
        row.classList.add('crypto-row');
        const change = crypto.price_change_percentage_24h || 0;
        const changeClass = change >= 0 ? 'up' : 'down';
        const changeSymbol = change >= 0 ? '▲' : '▼';
        const summary = coinSummaries[currentLang][crypto.id] || generateSummary(crypto, currentLang);
        const sym = currentCurrency === 'usd' ? '$' : '₩';
        const sparklineId = crypto.image.split('/')[5];

        row.innerHTML = `
            <span class="crypto-rank">${crypto.market_cap_rank}</span>
            <div class="crypto-info">
                <img class="crypto-icon" src="${crypto.image}" alt="${crypto.name}" loading="lazy">
                <div class="crypto-name-group">
                    <span class="crypto-name">${crypto.name}</span>
                    <span class="crypto-symbol">${crypto.symbol.toUpperCase()}</span>
                </div>
            </div>
            <div class="crypto-desc">${summary}</div>
            <div class="crypto-trend">
                <img src="https://www.coingecko.com/coins/${sparklineId}/sparkline.svg" alt="trend" loading="lazy">
            </div>
            <div class="crypto-price-container">
                <p class="crypto-price">${sym}${crypto.current_price.toLocaleString()}</p>
                <span class="crypto-change ${changeClass}">${changeSymbol} ${Math.abs(change).toFixed(2)}%</span>
            </div>
        `;
        row.addEventListener('click', () => openChart(crypto));
        cryptoContainer.appendChild(row);
    });

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    let pag = document.getElementById('pagination');
    if (!pag) {
        pag = document.createElement('div');
        pag.id = 'pagination';
        document.querySelector('main').appendChild(pag);
    }
    if (totalPages <= 1) { pag.innerHTML = ''; return; }

    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

    let html = `<button class="page-btn" onclick="goPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>‹</button>`;
    if (start > 1) html += `<button class="page-btn" onclick="goPage(1)">1</button>${start > 2 ? '<span id="page-info">…</span>' : ''}`;
    for (let i = start; i <= end; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
    }
    if (end < totalPages) html += `${end < totalPages - 1 ? '<span id="page-info">…</span>' : ''}<button class="page-btn" onclick="goPage(${totalPages})">${totalPages}</button>`;
    html += `<button class="page-btn" onclick="goPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>›</button>`;
    pag.innerHTML = html;
}

function goPage(page) {
    currentPage = page;
    renderCryptos(allCryptos);
    document.querySelector('main').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Events
themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    const t = translations[currentLang];
    themeToggle.textContent = isLight ? t.themeDark : t.themeLight;
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

searchInput.addEventListener('input', () => { currentPage = 1; renderCryptos(allCryptos); });

const categoryDescriptions = {
    en: {
        all: null,
        'layer-1': {
            icon: '⛓️',
            title: 'Layer 1 Blockchains',
            text: 'Layer 1 refers to the base blockchain itself — the foundational network where all transactions are recorded and validated. Examples include Bitcoin, Ethereum, and Solana. These blockchains are the settlement layer that everything else is built upon. Key metrics to evaluate: transaction speed (TPS), finality time, decentralization, and security track record.'
        },
        ai: {
            icon: '🤖',
            title: 'AI & Compute Tokens',
            text: 'AI tokens power blockchain projects focused on artificial intelligence, machine learning infrastructure, and decentralized compute networks. These include projects that monetize GPU resources (Render, Akash), train or run AI models on-chain (Bittensor, Fetch.ai), and build decentralized data marketplaces (The Graph, Ocean Protocol). This sector has seen strong growth as AI adoption accelerates globally.'
        },
        meme: {
            icon: '🐸',
            title: 'Meme Coins',
            text: 'Meme coins are cryptocurrencies that originated from internet culture, jokes, or viral trends. While Dogecoin started as a parody of Bitcoin in 2013, some meme coins have grown into multi-billion dollar assets with real communities. Meme coins are highly speculative and volatile — prices can rise or fall dramatically within hours based on social media sentiment and influencer activity. Only invest what you can afford to lose entirely.'
        },
        stablecoin: {
            icon: '🏦',
            title: 'Stablecoins',
            text: 'Stablecoins are cryptocurrencies designed to maintain a stable value, usually pegged 1:1 to the US dollar. They are essential infrastructure in the crypto ecosystem, used for trading, lending, earning yield, and transferring value without exposure to price volatility. Major stablecoins include USDT (Tether), USDC (Circle), and DAI (MakerDAO). When markets are uncertain, many investors move into stablecoins to preserve capital.'
        }
    },
    ko: {
        all: null,
        'layer-1': {
            icon: '⛓️',
            title: '레이어 1 블록체인',
            text: '레이어 1은 모든 거래가 기록되고 검증되는 기반 블록체인 네트워크를 말합니다. 비트코인, 이더리움, 솔라나가 대표적입니다. 모든 것이 그 위에 구축되는 정산 레이어입니다. 평가 시 주요 지표: 초당 거래량(TPS), 최종성 시간, 탈중앙화 수준, 보안 이력.'
        },
        ai: {
            icon: '🤖',
            title: 'AI & 컴퓨팅 토큰',
            text: 'AI 토큰은 인공지능, 머신러닝 인프라, 탈중앙화 컴퓨팅 네트워크에 초점을 맞춘 블록체인 프로젝트를 구동합니다. GPU 자원 수익화(Render, Akash), 온체인 AI 모델 학습 및 실행(Bittensor, Fetch.ai), 탈중앙화 데이터 마켓플레이스(The Graph) 등이 포함됩니다. 전 세계적으로 AI 도입이 가속화되면서 이 섹터는 강한 성장세를 보이고 있습니다.'
        },
        meme: {
            icon: '🐸',
            title: '밈 코인',
            text: '밈 코인은 인터넷 문화, 농담, 바이럴 트렌드에서 시작된 암호화폐입니다. 2013년 비트코인 패러디로 시작한 도지코인처럼 일부는 수십억 달러 규모의 커뮤니티로 성장했습니다. 밈 코인은 매우 투기적이고 변동성이 높아 소셜 미디어 심리와 인플루언서 활동에 따라 몇 시간 안에 큰 폭으로 등락할 수 있습니다. 전액 손실을 감당할 수 있는 금액만 투자하세요.'
        },
        stablecoin: {
            icon: '🏦',
            title: '스테이블코인',
            text: '스테이블코인은 보통 미국 달러에 1:1로 고정된 안정적인 가치를 유지하도록 설계된 암호화폐입니다. 거래, 대출, 수익 창출, 가격 변동성 없는 자산 이전을 위해 암호화폐 생태계의 필수 인프라로 활용됩니다. 주요 스테이블코인으로는 USDT(테더), USDC(서클), DAI(메이커다오)가 있습니다. 시장이 불확실할 때 많은 투자자들이 자산 보존을 위해 스테이블코인으로 이동합니다.'
        }
    }
};

function updateCategoryDesc(category) {
    const box = document.getElementById('category-desc-box');
    const desc = categoryDescriptions[currentLang][category];
    if (!desc) { box.style.display = 'none'; return; }
    document.getElementById('category-desc-icon').textContent = desc.icon;
    document.getElementById('category-desc-title').textContent = desc.title;
    document.getElementById('category-desc-text').textContent = desc.text;
    box.style.display = 'flex';
}

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        e.target.classList.add('active');
        currentCategory = e.target.dataset.category;
        currentPage = 1;
        renderCryptos(allCryptos);
        updateCategoryDesc(currentCategory);
    });
});

// ── AI Chat ──────────────────────────────────────────────
const chatFab = document.getElementById('chat-fab');
const chatPanel = document.getElementById('chat-panel');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');
const chatSuggestions = document.getElementById('chat-suggestions');

chatFab.addEventListener('click', () => {
    const isOpen = chatPanel.classList.toggle('open');
    chatFab.classList.toggle('open', isOpen);
    if (isOpen) chatInput.focus();
});

document.getElementById('chat-panel-close').addEventListener('click', () => {
    chatPanel.classList.remove('open');
    chatFab.classList.remove('open');
});

function buildMarketContext() {
    if (!allCryptos.length) return '시장 데이터 로딩 중';
    const top10 = allCryptos.slice(0, 10).map(c => {
        const ch = c.price_change_percentage_24h?.toFixed(2) ?? 'N/A';
        return `${c.name}(${c.symbol.toUpperCase()}): $${c.current_price.toLocaleString()} | 24h ${ch}%`;
    }).join('\n');
    const fgEl = document.getElementById('fear-greed-index');
    const fgStatus = document.getElementById('sentiment-status');
    const fg = fgEl ? `공포·탐욕 지수: ${fgEl.textContent} (${fgStatus.textContent})` : '';
    return `${fg}\n\n상위 10개 코인:\n${top10}`;
}

function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;
    div.appendChild(bubble);
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
}

function showTyping() {
    const div = document.createElement('div');
    div.className = 'chat-msg ai';
    div.id = 'chat-typing';
    div.innerHTML = '<div class="chat-typing"><span></span><span></span><span></span></div>';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
    const el = document.getElementById('chat-typing');
    if (el) el.remove();
}

async function sendChatMessage(message) {
    if (!message.trim()) return;
    chatSuggestions.style.display = 'none';
    appendMessage('user', message);
    chatInput.value = '';
    chatSendBtn.disabled = true;
    showTyping();

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, marketContext: buildMarketContext() }),
        });
        
        const data = await res.json();
        removeTyping();

        if (!res.ok) {
            appendMessage('ai', `⚠️ 오류: ${data.error || '응답을 가져올 수 없습니다.'}`);
        } else {
            appendMessage('ai', data.reply || '응답을 생성하는 중 오류가 발생했습니다.');
        }
    } catch (err) {
        removeTyping();
        appendMessage('ai', `🚫 연결 오류: 서버에 접속할 수 없습니다. (배포 상태를 확인해주세요.)`);
    } finally {
        chatSendBtn.disabled = false;
        chatInput.focus();
    }
}

chatSendBtn.addEventListener('click', () => sendChatMessage(chatInput.value));
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendChatMessage(chatInput.value); });

function sendSuggestion(btn) {
    sendChatMessage(btn.textContent);
}


// Init
if (localStorage.getItem('theme') === 'light') body.classList.add('light-mode');
updateLanguage();
fetchNews();
fetchFearAndGreed();
fetchGlobalStats();
fetchCryptos();
setInterval(fetchCryptos, 60000);
setInterval(fetchGlobalStats, 60000);
setInterval(fetchNews, 300000);
