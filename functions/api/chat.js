export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const { message, marketContext } = await request.json();

        if (!env.GEMINI_API_KEY) {
            return new Response(JSON.stringify({ error: "API Key 설정 필요" }), { status: 500 });
        }

        const prompt = `당신은 암호화폐 전문가입니다. 간결하고 빠르게 답변하세요.\n\n[데이터]\n${marketContext}\n\n[질문]\n${message}`;

        // 속도가 가장 빠른 초경량 모델 gemini-flash-lite-latest 사용
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${env.GEMINI_API_KEY}`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { 
                    temperature: 0.7,
                    maxOutputTokens: 600 // 답변 길이를 짧게 제한하여 속도 향상
                },
            })
        });

        const data = await response.json();

        if (data.error) {
            return new Response(JSON.stringify({ error: data.error.message }), { status: 500 });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        return new Response(JSON.stringify({ reply }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
