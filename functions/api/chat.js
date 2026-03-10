export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const { message, marketContext } = await request.json();

        if (!env.GEMINI_API_KEY) {
            return new Response(JSON.stringify({ error: "API Key가 설정되지 않았습니다." }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        const prompt = `당신은 암호화폐 시장 전문가입니다. 아래 데이터를 바탕으로 답변하세요.\n\n[데이터]\n${marketContext}\n\n[질문]\n${message}`;

        // 가장 호환성이 높은 gemini-pro (1.0) 모델로 변경하여 테스트
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${env.GEMINI_API_KEY}`;

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
                error: `Gemini API 오류: ${data.error.message}`,
                model: "gemini-pro"
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!reply) {
            return new Response(JSON.stringify({ error: "응답 생성 실패 (모델 호환성 문제일 수 있습니다.)" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        return new Response(JSON.stringify({ reply }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: `통신 오류: ${err.message}` }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
