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
