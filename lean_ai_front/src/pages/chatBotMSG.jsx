import React, { useEffect, useState } from 'react';

export default function Chatbot({ agentId }) {

    return (
        <>
            <df-messenger
                location="asia-northeast1"
                project-id="lean-ai-faq"
                agent-id={agentId} // agentId를 여기에서 사용
                language-code="ko"
                session-persistence="false"
                style={{ position: 'fixed', bottom: '20px', right: '15px' }}
            >
                <df-messenger-chat-bubble
                    chat-title-icon="/chatbot.png"
                    chat-icon="/chatbot.png"
                ></df-messenger-chat-bubble>
            </df-messenger>

            <style jsx global>{`
                df-messenger {
                    --df-messenger-chat-window-width: 540%;
                    --df-messenger-chat-bubble-background: #fde047;
                }

                @keyframes sparkleText {
                    0%, 100% {
                        color: black;
                        text-shadow: none;
                    }
                    50% {
                        color: white;
                        text-shadow: 0 0 10px rgba(255, 255, 255, 0.8),
                                     0 0 20px rgba(255, 255, 255, 0.6),
                                     0 0 30px rgba(255, 255, 255, 0.5);
                    }
                }
            `}</style>
        </>
    );
}
