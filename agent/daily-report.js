/**
 * Crypto Intelligence — Daily Market Report Agent
 * 매일 아침 7시(KST) 실행 → Gemini로 시장 분석 → Telegram 발송
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function fetchTopCoins() {
    const res = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false&price_change_percentage=24h,7d'
    );
    if (!res.ok) throw new Error('CoinGecko fetch failed');
    return res.json();
}

async function fetchFearGreed() {
    const res = await fetch('https://api.alternative.me/fng/');
    if (!res.ok) throw new Error('Fear&Greed fetch failed');
    const data = await res.json();
    return data.data[0];
}

async function fetchGlobalStats() {
    const res = await fetch('https://api.coingecko.com/api/v3/global');
    if (!res.ok) throw new Error('Global stats fetch failed');
    const data = await res.json();
    return data.data;
}

function formatMarketData(coins, fearGreed, global) {
    const totalMcap = (global.total_market_cap.usd / 1e12).toFixed(2);
    const btcDom = global.market_cap_percentage.btc.toFixed(1);
    const vol24h = (global.total_volume.usd / 1e9).toFixed(1);

    const topCoinsText = coins.slice(0, 10).map((c, i) => {
        const change24h = c.price_change_percentage_24h?.toFixed(2) ?? 'N/A';
        const change7d = c.price_change_percentage_7d_in_currency?.toFixed(2) ?? 'N/A';
        const sign24 = change24h > 0 ? '+' : '';
        const sign7d = change7d > 0 ? '+' : '';
        return `${i + 1}. ${c.name} (${c.symbol.toUpperCase()}): $${c.current_price.toLocaleString()} | 24h: ${sign24}${change24h}% | 7d: ${sign7d}${change7d}%`;
    }).join('\n');

    return `
[글로벌 시장]
- 총 시가총액: $${totalMcap}조
- 24h 거래량: $${vol24h}십억
- BTC 도미넌스: ${btcDom}%
- 공포·탐욕 지수: ${fearGreed.value} (${fearGreed.value_classification})

[상위 10개 코인]
${topCoinsText}
    `.trim();
}

async function generateReport(marketSummary) {
    const today = new Date().toLocaleDateString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
    });

    const prompt = `당신은 암호화폐 시장 전문 애널리스트입니다. 아래 실시간 시장 데이터를 바탕으로 오늘의 암호화폐 시장 일일 리포트를 작성하세요.

오늘 날짜: ${today}

${marketSummary}

다음 형식으로 한국어로 작성하세요 (Telegram Markdown 형식):

*📊 오늘의 크립토 시장 리포트*
${today}

*🌡️ 시장 심리*
[공포·탐욕 지수 해석 및 현재 시장 분위기 1-2문장]

*📈 주요 동향*
[오늘 주목할 만한 코인 움직임 2-3가지, 각 1문장]

*💡 오늘의 인사이트*
[현재 시장 상황에서 투자자가 주목해야 할 점 2-3가지]

*⚠️ 주의사항*
[리스크 요인 1-2가지]

_⚡ Crypto Intelligence AI Agent | 투자 조언 아님_

간결하고 실용적으로 작성하세요. 과도한 낙관이나 비관은 피하고, 데이터 기반으로 중립적으로 분석하세요.`;

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.6, maxOutputTokens: 800 },
            }),
        }
    );

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Gemini error: ${err}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
}

async function sendTelegram(message) {
    const res = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown',
            }),
        }
    );
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Telegram error: ${err}`);
    }
    return res.json();
}

(async () => {
    console.log('🚀 Daily report agent starting...');
    try {
        console.log('📡 Fetching market data...');
        const [coins, fearGreed, global] = await Promise.all([
            fetchTopCoins(),
            fetchFearGreed(),
            fetchGlobalStats(),
        ]);

        console.log('🤖 Generating AI report...');
        const marketSummary = formatMarketData(coins, fearGreed, global);
        const report = await generateReport(marketSummary);

        console.log('📨 Sending to Telegram...');
        await sendTelegram(report);

        console.log('✅ Daily report sent successfully!');
    } catch (err) {
        console.error('❌ Agent failed:', err.message);
        // 실패 시 텔레그램으로 에러 알림
        try {
            await sendTelegram(`⚠️ *Crypto Intelligence Agent 오류*\n\n${err.message}\n\n수동으로 확인이 필요합니다.`);
        } catch (_) {}
        process.exit(1);
    }
})();
