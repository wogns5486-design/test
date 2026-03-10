export async function onRequestPost(context) {
    const { env } = context;

    try {
        if (!env.GEMINI_API_KEY) {
            return new Response(JSON.stringify({ error: "API Key가 설정되지 않았습니다." }), { status: 500 });
        }

        // 사용 가능한 모델 목록 조회 (디버깅용)
        const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${env.GEMINI_API_KEY}`;
        const listRes = await fetch(listUrl);
        const listData = await listRes.json();

        if (listData.error) {
            return new Response(JSON.stringify({ 
                error: `API 키 확인 실패: ${listData.error.message}`,
                hint: "Google AI Studio에서 새로운 API 키를 발급받아보세요."
            }), { status: 500 });
        }

        // 사용 가능한 모델 이름들만 추출
        const availableModels = listData.models?.map(m => m.name.replace('models/', '')) || [];

        return new Response(JSON.stringify({ 
            error: "사용 가능한 모델 목록을 찾았습니다. 아래 목록 중 하나를 선택해야 합니다.",
            reply: `현재 사용 가능한 모델 목록:\n${availableModels.join('\n')}\n\n이 목록에 gemini-1.5-flash가 없다면 키를 새로 발급받아야 합니다.`
        }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: `디버깅 시도 중 오류: ${err.message}` }), { status: 500 });
    }
}
