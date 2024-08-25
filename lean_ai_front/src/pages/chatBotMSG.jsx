import React, { useEffect } from 'react';

export default function Chatbot() {
    useEffect(() => {
        sessionStorage.removeItem('df-messenger-session'); // 새로고침 시 세션 초기화

        }, []);
        
    return (
        <div>
        <df-messenger
            location="asia-northeast1"
            project-id="lean-ai-faq"
            agent-id="32293af4-f3fd-4102-8416-169801a34840"
            language-code="ko"
            session-persistence="false" // 세션이 새로 고침할 때 초기화되도록 설정
        ></df-messenger>

        <style jsx>{`
            df-messenger {
            z-index: 999;
            position: fixed;
            bottom: 16px;
            right: 16px;
            --df-messenger-font-color: #000;
            --df-messenger-font-family: Google Sans;
            --df-messenger-chat-background: #f3f6fc;
            --df-messenger-message-user-background: #d3e3fd;
            --df-messenger-message-bot-background: #fff;
            }
        `}</style>
        </div>
    );
}
