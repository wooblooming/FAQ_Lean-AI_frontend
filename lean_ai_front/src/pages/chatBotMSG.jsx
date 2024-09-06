import React, { useEffect, useState } from 'react';

export default function Chatbot({ agentId }) {
    const [sessionId, setSessionId] = useState(null);

    useEffect(() => {
        const createNewSession = () => {
            // 새로운 세션 ID 생성
            const newSessionId = `session-${Math.random().toString(36).substr(2, 9)}`;
            setSessionId(newSessionId);

            const dfMessenger = document.querySelector('df-messenger');
            if (dfMessenger) {
                dfMessenger.setAttribute('session-id', newSessionId);
                if (typeof dfMessenger.startNewSession === 'function') {
                    dfMessenger.startNewSession({ retainHistory: false });
                }
            }
        };

        // 페이지 로드 시 한 번만 세션 초기화
        createNewSession();

        // 페이지 새로고침 시 세션 초기화
        const handlePageRefresh = () => {
            createNewSession();
            localStorage.removeItem('greeted'); // 새로고침 시 greeted 상태 초기화
        };

        const handleChatOpenChanged = (event) => {
            console.log(`Chat is ${event.detail.isOpen ? 'open' : 'closed'}`);
            const dfMessenger = document.querySelector('df-messenger');

            const sendGreetingMessage = () => {
                if (dfMessenger && !localStorage.getItem('greeted')) {
                    try {
                        dfMessenger.sendQuery('안녕');
                        console.log('Sent greeting message automatically.');
                        localStorage.setItem('greeted', 'true');
                    } catch (error) {
                        console.error('Error sending greeting message:', error);
                    }
                }
            };

            if (event.detail.isOpen && dfMessenger) {
                // df-messenger가 로드된 경우 메시지를 바로 전송
                if (dfMessenger.loaded) {
                    sendGreetingMessage();
                } else {
                    // 로드된 후에도 동작하지 않으면 타이머를 사용해 일정 시간 후에 재시도
                    const timer = setTimeout(sendGreetingMessage, 1000); // 1초 후 시도
                    dfMessenger.addEventListener('df-messenger-loaded', () => {
                        clearTimeout(timer);
                        sendGreetingMessage();
                    }, { once: true });
                }
            }
        };

        // 새로고침 시 이벤트 리스너 추가
        window.addEventListener('beforeunload', handlePageRefresh);
        // 채팅 열리고 닫힐 때 이벤트 리스너 추가
        window.addEventListener('df-chat-open-changed', handleChatOpenChanged);

        // Cleanup: 이벤트 리스너 제거
        return () => {
            window.removeEventListener('beforeunload', handlePageRefresh);
            window.removeEventListener('df-chat-open-changed', handleChatOpenChanged);
        };
    }, [agentId]);

    return (
        <>
            {sessionId && (
                <df-messenger
                    location="asia-northeast1"
                    project-id="lean-ai-faq"
                    agent-id={agentId}
                    language-code="ko"
                    session-id={sessionId}
                    session-persistence="true"
                    style={{ 
                        position: 'fixed',
                        bottom: '20px', 
                        right: '15px',
                        '--df-messenger-chat-bubble-background' : '#F3D7CA',
                        '--df-messenger-chat-border-radius': '10px',
                        '--df-messenger-chat-border': '1.8px solid #982B1C',
                        '--df-messenger-chat-window-box-shadow': '5px 5px 10px rgba(0, 0, 0, 0.3)',
                        '--df-messenger-chat-bubble-icon-size' : '56px',
                        '--df-messenger-chat-bubble-icon-background' : '#F3D7CA',
                        '--df-messenger-chat-bubble-border' : '1.8px solid #982B1C',
                        '--df-messenger-chat-bubble-size' : '64px',
                        '--df-messenger-titlebar-background' : '#F3D7CA',
                        '--df-messenger-titlebar-border-bottom' : '1.8px solid #982B1C',
                        '--df-messenger-titlebar-title-font-weight' : '600',
                        '--df-messenger-titlebar-title-line-height': '2',
                        '--df-messenger-titlebar-title-letter-spacing': '0.7px',
                        '--df-messenger-titlebar-icon-width':'40px',
                        '--df-messenger-titlebar-icon-height':'40px',
                        '--df-messenger-titlebar-icon-padding': '0 15px 0 0',
                        '--df-messenger-chat-background' : '#F5EEE6',
                        '--df-messenger-chat-padding' : '10px',
                        '--df-messenger-message-bot-background' : '#FFF8E3',
                        '--df-messenger-message-user-background' : '#FFF8E3',
                        '--df-messenger-chip-background': '#FFF8E3', // chips의 배경색 설정
                        '--df-messenger-chip-hover-background': '#F3D7CA', // chips hover 시 배경색 설정
                        '--df-messenger-message-user-border' : '1px solid #982B1C',
                        '--df-messenger-message-bot-border' : '1px solid #982B1C',
                        '--df-messenger-message-user-font-weight' : '600',
                        '--df-messenger-message-bot-font-weight' : '600',
                        '--df-messenger-message-stack-spacing': '5px',
                        '--df-messenger-send-icon-color' : '#7469B6',
                        '--df-messenger-send-icon-color-hover' : '#7469B6',
                        '--df-messenger-input-background' : '#E6A4B4',
                        '--df-messenger-input-border-top' : '1px solid #982B1C',
                        '--df-messenger-input-font-weight' : '600',
                        '--df-messenger-input-box-border' : '1px solid #982B1C',
                        '--df-messenger-input-box-focus-border' : '2px solid #164863',
                        '--df-messenger-message-bot-actor-background' : '#FFF8E3',
                    }}

                >
                    <df-messenger-chat-bubble
                        chat-title-icon="/chatbot.png"
                        chat-icon="/chatbot.png"
                        chat-title="MUMUL BOT"
                        placeholder-text="자유롭게 질문해주세요"
                        bot-actor-image="/chatbot.png"
                        allow-fullscreen="always"
                        
                    ></df-messenger-chat-bubble>
                </df-messenger>
            )}

        </>
    );
}
