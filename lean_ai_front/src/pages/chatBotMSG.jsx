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
            sessionStorage.removeItem('greeted'); // 새로고침 시 greeted 상태 초기화
        };

        const handleChatOpenChanged = (event) => {
            console.log(`Chat is ${event.detail.isOpen ? 'open' : 'closed'}`);
            const dfMessenger = document.querySelector('df-messenger');

            const sendGreetingMessage = () => {
                if (dfMessenger && !sessionStorage.getItem('greeted')) {
                    try {
                        dfMessenger.sendQuery('안녕');
                        console.log('Sent greeting message automatically.');
                        sessionStorage.setItem('greeted', 'true');
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
                        
                        '--df-messenger-chat-bubble-background': 'white', // 그라데이션 배경
                        '--df-messenger-chat-border-radius': '5px solid rgb(79, 70, 229)',
                        '--df-messenger-chat-window-box-shadow': '5px 5px 10px rgba(0, 0, 0, 0.3)',
                        '--df-messenger-chat-bubble-icon-size': '48px',
                        '--df-messenger-chat-bubble-icon-color': 'rgb(79, 70, 229)',
                        '--df-messenger-chat-bubble-icon-background': 'black', // 그라데이션 배경
                        '--df-messenger-chat-bubble-border': '1px solid rgb(79 70 229)',
                        '--df-messenger-chat-bubble-close-icon': 'white', // 닫기 버튼 아이콘 색상
                        '--df-messenger-chat-bubble-close-icon-color': 'white', // 닫기 버튼 아이콘의 색상을 흰색으로 설정
                        '--df-messenger-chat-bubble-size': '64px',
                        '--df-messenger-titlebar-background': 'linear-gradient(135deg,  rgb(79 70 229),  rgb(69 70 229))', 
                        '--df-messenger-titlebar-border-bottom': '1.8px solid rgb(79, 70, 229)',
                        '--df-messenger-titlebar-border-top': '1.8px solid rgb(79, 70, 229)',
                        
                        '--df-messenger-titlebar-font-color' : 'white',
                        
                        '--df-messenger-titlebar-title-font-weight': '600',
                        '--df-messenger-titlebar-title-line-height': '2',
                        '--df-messenger-titlebar-title-letter-spacing': '0.7px',
                        '--df-messenger-titlebar-icon-width': '40px',
                        '--df-messenger-titlebar-icon-height': '40px',
                        '--df-messenger-titlebar-icon-padding': '0 15px 0 0',
                        '--button.material-icons.close-action.focus-outline-contrast.action-button-color' : 'white',
                        '--df-messenger-chat-background': '#efefef', 
                        '--df-messenger-chat-padding': '10px',
                        '--df-messenger-message-bot-background': 'white', // 더 밝고 부드러운 봇 메시지 배경
                        '--df-messenger-message-user-background': 'white',
                        '--df-messenger-chip-background': 'linear-gradient(135deg, rgb(224, 231, 255), rgb(243, 232, 255))', // 그라데이션 배경
                        '--df-messenger-chip-hover-background': 'linear-gradient(135deg, rgb(243, 232, 255), rgb(252, 231, 243))', // 그라데이션 배경
                        
                        '--df-messenger-message-user-font-weight': '600',
                        '--df-messenger-message-bot-font-weight': '600',
                        '--df-messenger-message-stack-spacing': '5px',
                        '--df-messenger-send-icon-color': 'white',
                        '--df-messenger-send-icon-color-hover': 'red',
                        '--df-messenger-send-icon-color-active' : 'white',
                        '--df-messenger-input-background': 'linear-gradient(135deg,  rgb(79 70 229),  rgb(69 70 229))', // 그라데이션 배경
                        '--df-messenger-input-border-top': '1px solid rgb(139, 92, 246)',
                        '--df-messenger-input-font-weight': '600',
                        '--df-messenger-input-box-border': '1px solid black',
                        '--df-messenger-input-box-focus-border': '2px solid rgb(79, 70, 229)',
                        '--df-messenger-message-bot-actor-background': 'white', // 그라데이션 배경
                    }}
                >
                    <df-messenger-chat-bubble
                        chat-title-icon="/chatbot.png"
                        
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
