import React, { useEffect, useState } from 'react';

export default function Chatbot({ agentId }) {
    const [sessionId, setSessionId] = useState(null);

    useEffect(() => {
        const createNewSession = () => {
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

        createNewSession();

        const handlePageRefresh = () => {
            createNewSession();
            sessionStorage.removeItem('greeted');
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
                if (dfMessenger.loaded) {
                    sendGreetingMessage();
                } else {
                    const timer = setTimeout(sendGreetingMessage, 1000);
                    dfMessenger.addEventListener('df-messenger-loaded', () => {
                        clearTimeout(timer);
                        sendGreetingMessage();
                    }, { once: true });
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
                        chat-title-icon="/mumul.png"
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