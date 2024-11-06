import React, { useEffect, useState } from 'react';

export default function Chatbot({ agentId }) {
    const [sessionId, setSessionId] = useState(null);

    useEffect(() => {
        const createNewSession = () => {
            const newSessionId = `session-${Math.random().toString(36).substr(2, 9)}`;
            setSessionId(newSessionId);

            const dfMessenger = document.querySelector('df-messenger');
            sessionStorage.removeItem('greeted'); // 세션 새로 고침 시 greeted 초기화

            if (dfMessenger) {
                dfMessenger.setAttribute('session-id', newSessionId);
                if (typeof dfMessenger.startNewSession === 'function') {
                    dfMessenger.startNewSession({ retainHistory: false });
                }
            }
        };

        createNewSession();

        const handlePageRefresh = () => {
            createNewSession();
            sessionStorage.removeItem('greeted'); // 새로 고침 시 greeted 초기화
        };

        const handleChatOpenChanged = (event) => {
            const dfMessenger = document.querySelector('df-messenger');
            if (event.detail.isOpen && dfMessenger) {
                createNewSession();  // 챗봇 창이 열릴 때 세션 새로 고침
                const sendGreetingMessage = () => {
                    if (!sessionStorage.getItem('greeted')) {
                        try {
                            dfMessenger.sendQuery('안녕');
                            sessionStorage.setItem('greeted', 'true');
                        } catch (error) {
                            console.error('Error sending greeting message:', error);
                        }
                    }
                };

                if (dfMessenger.loaded) {
                    sendGreetingMessage();
                } else {
                    const timer = setTimeout(sendGreetingMessage, 1000);
                    dfMessenger.addEventListener(
                        'df-messenger-loaded',
                        () => {
                            clearTimeout(timer);
                            sendGreetingMessage();
                        },
                        { once: true }
                    );
                }
            }
        };

        window.addEventListener('beforeunload', handlePageRefresh);
        window.addEventListener('df-chat-open-changed', handleChatOpenChanged);

        return () => {
            window.removeEventListener('beforeunload', handlePageRefresh);
            window.removeEventListener('df-chat-open-changed', handleChatOpenChanged);
        };
    }, [agentId]);

    useEffect(() => {
        const applyCustomStyle = () => {
          const chatBubble = document.querySelector("#__next > div:nth-child(2) > df-messenger > df-messenger-chat-bubble");
          
          if (chatBubble && chatBubble.shadowRoot) {
            const titleBar = chatBubble.shadowRoot.querySelector("#df-chat-wrapper > df-messenger-titlebar");
            
            if (titleBar && titleBar.shadowRoot) {
              const actionsElement = titleBar.shadowRoot.querySelector("div > div.actions");
              if (actionsElement) {
                actionsElement.style.mixBlendMode = 'plus-lighter';
              }
            }
          }
        };
    
        setTimeout(applyCustomStyle, 1000);  // 로드 후 1초 지연
    }, []);

    return (
        <div>
            {sessionId && (
                <df-messenger
                    location="asia-northeast1"
                    project-id="lean-ai-faq"
                    agent-id={agentId}
                    language-code="ko"
                    session-id={sessionId}
                    session-persistence="true"
                    style={{
                        zIndex:'30',
                        position: 'fixed',
                        bottom: '20px',
                        right: '5px',
                        '--df-messenger-chat-bubble-background': 'white', 
                        '--df-messenger-chat-border-radius': '5px solid rgb(79, 70, 229)',
                        '--df-messenger-chat-window-box-shadow': '5px 5px 10px rgba(0, 0, 0, 0.3)',
                        '--df-messenger-chat-bubble-icon-size': '48px',
                        '--df-messenger-chat-bubble-icon-color': 'rgb(79, 70, 229)',
                        '--df-messenger-chat-bubble-icon-background': 'black', 
                        '--df-messenger-chat-bubble-border': '1px solid rgb(79 70 229)',
                        '--df-messenger-button-color': '#ffffff',
                        '--df-messenger-close-button-color': '#ffffff',
                        '--df-messenger-icon-font-color': '#ffffff',
                        '--df-messenger-chat-bubble-close-icon-color': '#ffffff !important',
                        '--df-messenger-close-icon-color': '#ffffff',
                        '--df-messenger-chat-bubble-size': '64px',
                        '--df-messenger-titlebar-background': 'linear-gradient(135deg,  rgb(79 70 229),  rgb(69 70 229))',
                        '--df-messenger-titlebar-border-bottom': '1.8px solid rgb(79, 70, 229)',
                        '--df-messenger-titlebar-border-top': '1.8px solid rgb(79, 70, 229)',
                        '--df-messenger-titlebar-font-color': 'white',
                        '--df-messenger-titlebar-title-font-weight': '600',
                        '--df-messenger-titlebar-title-line-height': '2',
                        '--df-messenger-titlebar-title-letter-spacing': '0.7px',
                        '--df-messenger-titlebar-icon-width': '40px',
                        '--df-messenger-titlebar-icon-height': '40px',
                        '--df-messenger-titlebar-icon-padding': '0 15px 0 0',
                        '--df-messenger-chat-background': '#efefef',
                        '--df-messenger-chat-padding': '10px',
                        '--df-messenger-message-bot-background': 'white',
                        '--df-messenger-message-user-background': 'white',
                        '--df-messenger-chip-background': 'linear-gradient(135deg, rgb(224, 231, 255), rgb(243, 232, 255))',
                        '--df-messenger-chip-hover-background': 'linear-gradient(135deg, rgb(243, 232, 255), rgb(252, 231, 243))',
                        '--df-messenger-message-user-font-weight': '600',
                        '--df-messenger-message-bot-font-weight': '600',
                        '--df-messenger-message-stack-spacing': '5px',
                        '--df-messenger-send-icon-color': 'white',
                        '--df-messenger-send-icon-color-hover': '#c084fc',
                        '--df-messenger-send-icon-color-active': 'white',
                        '--df-messenger-input-background': 'linear-gradient(135deg,  rgb(79 70 229),  rgb(69 70 229))',
                        '--df-messenger-input-border-top': '1px solid rgb(139, 92, 246)',
                        '--df-messenger-input-font-weight': '600',
                        '--df-messenger-input-box-border': '1px solid black',
                        '--df-messenger-input-box-focus-border': '2px solid rgb(79, 70, 229)',
                        '--df-messenger-message-bot-actor-background': 'white',
                    }}
                >
                    <df-messenger-chat-bubble
                        chat-icon="/mumul2.png"
                        chat-title-icon="/mumul.png"
                        chat-title="MUMUL BOT"
                        placeholder-text="자유롭게 질문해주세요"
                        bot-actor-image="/chatbot.png"
                        allow-fullscreen="always"
                    ></df-messenger-chat-bubble>
                </df-messenger>
            )}
        </div>
    );
}
