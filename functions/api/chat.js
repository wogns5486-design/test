export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const { message, marketContext } = await request.json();

        if (!env.GEMINI_API_KEY) {
            return new Response(JSON.stringify({ error: "API Key 설정 필요" }), { status: 500 });
        }

        const prompt = `당신은 암호화폐 시장 전문가입니다. 아래 실시간 데이터를 바탕으로 답변하세요.\n\n[데이터]\n${marketContext}\n\n[질문]\n${message}`;

        // 쿼터 문제가 적은 gemini-flash-latest 별칭 사용
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${env.GEMINI_API_KEY}`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { 
                    temperature: 0.7,
                    maxOutputTokens: 800 
                },
            })
        });

        const data = await response.json();

        if (data.error) {
            return new Response(JSON.stringify({ 
                error: `쿼터 또는 권한 오류: ${data.error.message}`,
                hint: "gemini-flash-latest 모델의 할당량을 확인해주세요."
            }), { status: 500 });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!reply) {
            return new Response(JSON.stringify({ error: "응답을 생성할 수 없습니다." }), { status: 500 });
        }

        return new Response(JSON.stringify({ reply }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: `통신 오류: ${err.message}` }), { status: 500 });
    }
}
