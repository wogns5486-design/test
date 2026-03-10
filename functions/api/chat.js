export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const { message, marketContext } = await request.json();

        if (!env.GEMINI_API_KEY) {
            return new Response(JSON.stringify({ error: "Gemini API Key가 Cloudflare 설정에 없습니다. Settings -> Variables에서 등록했는지 확인해주세요." }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        const prompt = `당신은 암호화폐 시장 전문가입니다. 아래 실시간 시장 데이터를 바탕으로 사용자의 질문에 친절하고 전문적으로 답변하세요.

[현재 시장 데이터]
${marketContext}

[사용자 질문]
${message}

전문적이면서도 이해하기 쉽게 한국어로 답변해 주세요. (마크다운 형식 사용 가능)`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
                }),
            }
        );

        const data = await response.json();

        // Gemini API 에러가 있는 경우
        if (data.error) {
            return new Response(JSON.stringify({ error: `Gemini API 오류: ${data.error.message}` }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!reply) {
            return new Response(JSON.stringify({ error: "Gemini가 빈 응답을 보냈습니다. (Safety Filter에 걸렸을 수 있습니다.)", raw: data }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        return new Response(JSON.stringify({ reply }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: `서버 내부 오류: ${err.message}` }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
