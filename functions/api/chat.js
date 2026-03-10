export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const { message, marketContext } = await request.json();

        if (!env.GEMINI_API_KEY) {
            return new Response(JSON.stringify({ error: "API Key가 설정되지 않았습니다." }), { status: 500 });
        }

        const prompt = `당신은 암호화폐 시장 전문가입니다. 아래 실시간 데이터를 바탕으로 답변하세요.\n\n[시장 데이터]\n${marketContext}\n\n[질문]\n${message}`;

        // 사용자님의 강력한 키가 지원하는 gemini-2.0-flash 모델 사용
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { 
                    temperature: 0.7,
                    maxOutputTokens: 1000 
                },
            })
        });

        const data = await response.json();

        if (data.error) {
            return new Response(JSON.stringify({ error: `Gemini API 오류: ${data.error.message}` }), { status: 500 });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!reply) {
            return new Response(JSON.stringify({ error: "응답을 생성할 수 없습니다." }), { status: 500 });
        }

        return new Response(JSON.stringify({ reply }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: `서버 통신 오류: ${err.message}` }), { status: 500 });
    }
}
