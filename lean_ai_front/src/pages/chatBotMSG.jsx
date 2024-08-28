import React, { useEffect, useState } from 'react';

export default function Chatbot({ agentId }) {
    const [sessionId, setSessionId] = useState(null);

    useEffect(() => {
        // 매번 새로운 세션 ID 생성
        const newSessionId = `session-${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(newSessionId);

        const resetSession = () => {
            const dfMessenger = document.querySelector('df-messenger');
            if (dfMessenger) {
                // startNewSession을 호출하여 강제로 새 세션 시작
                dfMessenger.setAttribute('session-id', newSessionId);
                if (typeof dfMessenger.startNewSession === 'function') {
                    dfMessenger.startNewSession({ retainHistory: false });
                }
            }
        };

        // DOM 요소가 렌더링된 후 resetSession을 호출
        setTimeout(resetSession, 500);

    }, [agentId]);

    return (
        <>
            {sessionId && (
                <df-messenger
                    location="asia-northeast1"
                    project-id="lean-ai-faq"
                    agent-id={agentId} // agentId를 여기에서 사용
                    language-code="ko"
                    session-id={sessionId} // 새로운 session-id를 설정
                    session-persistence="false"
                    style={{ position: 'fixed', bottom: '20px', right: '15px' }}
                >
                    <df-messenger-chat-bubble
                        chat-title-icon="/chatbot.png"
                        chat-icon="/chatbot.png"
                    ></df-messenger-chat-bubble>
                </df-messenger>
            )}

            <style jsx global>{`
                df-messenger {
                    --df-messenger-chat-window-width: 500%;
                    --df-messenger-chat-bubble-background: #fde047;
                }
            `}</style>
        </>
    );
}
