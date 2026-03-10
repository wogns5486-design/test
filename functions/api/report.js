export async function onRequestGet(context) {
    const { env } = context;

    try {
        if (!env.GEMINI_API_KEY) {
            return new Response(JSON.stringify({ error: "API Key missing" }), { status: 500 });
        }

        // 1. 기초 데이터 수집
        const [fngRes, globalRes] = await Promise.all([
            fetch('https://api.alternative.me/fng/'),
            fetch('https://api.coingecko.com/api/v3/global')
        ]);
        
        const fngData = await fngRes.json();
        const globalRaw = await globalRes.json();
        
        // 데이터 구조 안전하게 추출
        const fngValue = fngData.data?.[0]?.value || "N/A";
        const fngClass = fngData.data?.[0]?.value_classification || "N/A";
        const btcDom = globalRaw.data?.market_cap_percentage?.btc?.toFixed(1) || "N/A";

        // 2. AI 리포트 생성 프롬프트
        const prompt = `당신은 세계적인 암호화폐 시장 분석가입니다. 오늘의 시장 데이터를 바탕으로 투자자들을 위한 심층 리포트를 작성하세요.
        
[데이터]
- 공포·탐욕 지수: ${fngValue} (${fngClass})
- 비트코인 점유율(Dom): ${btcDom}%
- 분석 날짜: ${new Date().toLocaleDateString('ko-KR')}

[지침]
1. 반드시 한국어로 작성하세요.
2. 마크다운 형식을 사용하세요.
3. 섹션: 🌡️ 시장 심리 분석, 📈 주요 지표 및 동향, 💡 오늘의 투자 인사이트, ⚠️ 리스크 주의사항.
4. 최소 500자 이상의 충분한 분량으로 전문적인 어조를 유지하세요. (애드센스 승인용 고품질 콘텐츠)
5. 마지막에는 "⚡ Crypto Intelligence AI 에이전트 제공" 문구를 넣으세요.`;

        // 아까 확인한 가장 빠른 라이트 모델 사용
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${env.GEMINI_API_KEY}`;
        
        const aiRes = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 1500 }
            })
        });

        const aiData = await aiRes.json();
        const reportText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "리포트를 생성할 수 없습니다.";

        return new Response(JSON.stringify({
            report: reportText,
            date: new Date().toLocaleDateString('ko-KR'),
            fng: fngValue
        }), {
            headers: { 
                "Content-Type": "application/json",
                "Cache-Control": "public, max-age=3600"
            }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: `데이터 처리 오류: ${err.message}` }), { status: 500 });
    }
}
