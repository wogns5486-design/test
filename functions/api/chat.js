/**
 * Cloudflare Pages Function — /api/chat
 * Proxies requests to Gemini API (keeps API key secret)
 */

const SYSTEM_PROMPT = `You are an expert cryptocurrency market analyst AI assistant embedded in a real-time crypto dashboard called "Crypto Intelligence."

Your role:
- Answer questions about cryptocurrency markets, coins, investment strategies, and market conditions
- Analyze the real-time market data provided with each question
- Give actionable, concise insights based on current data
- Support BOTH English and Korean — always respond in the SAME language the user asked in
- Be honest about uncertainty; markets are unpredictable
- Keep responses focused and to the point (3-5 sentences max unless detailed analysis is requested)

Always end responses with a brief disclaimer: "(참고용 정보이며 투자 조언이 아닙니다)" in Korean questions, or "(For informational purposes only, not financial advice)" in English questions.

Tone: Professional but approachable, like a knowledgeable friend who understands crypto.`;

export async function onRequestPost(context) {
    const { request, env } = context;

    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };

    try {
        const { message, marketContext } = await request.json();

        if (!message) {
            return new Response(JSON.stringify({ error: 'No message provided' }), { status: 400, headers: corsHeaders });
        }

        const prompt = `${SYSTEM_PROMPT}

--- CURRENT MARKET DATA (real-time) ---
${marketContext}
--- END MARKET DATA ---

User question: ${message}`;

        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 512,
                    },
                }),
            }
        );

        if (!geminiRes.ok) {
            const err = await geminiRes.text();
            console.error('Gemini error:', err);
            return new Response(JSON.stringify({ error: 'AI service error' }), { status: 502, headers: corsHeaders });
        }

        const data = await geminiRes.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '응답을 생성할 수 없습니다.';

        return new Response(JSON.stringify({ reply }), { headers: corsHeaders });

    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: corsHeaders });
    }
}

// CORS preflight
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
