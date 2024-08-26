import React, { useEffect } from 'react';

export default function Chatbot() {
    useEffect(() => {
        const applyStyles = async () => {
            try {
                const dfMessenger = document.querySelector('df-messenger');
                if (dfMessenger) {
                    const shadowRoot = dfMessenger.shadowRoot;

                    const bubbleWrapper = shadowRoot.querySelector('div.chat-bubble-default-wrapper');
                    if (bubbleWrapper) {
                        const chatBubbleElement = bubbleWrapper.querySelector('df-messenger-chat-bubble');
                        if (chatBubbleElement && chatBubbleElement.shadowRoot) {
                            const bubbleButton = chatBubbleElement.shadowRoot.querySelector('button.bubble.focus-outline');
                            if (bubbleButton) {
                                bubbleButton.style.backgroundColor = 'transparent';
                                bubbleButton.style.border = 'none';
                                bubbleButton.style.boxShadow = 'none';
                                bubbleButton.style.opacity = '0';
                                bubbleButton.style.visibility = 'hidden';  // 완전히 숨김
                                console.log('Bubble button styles applied.');
                            } else {
                                console.log('Bubble button not found.');
                            }

                            const chatWrapper = chatBubbleElement.shadowRoot.querySelector('div.chat-wrapper');
                            if (chatWrapper) {
                                if (!document.querySelector('.custom-chatbot-icon')) {
                                    const customButton = document.createElement('img');
                                    customButton.src = '/chatbot.png'; // 이미지 경로
                                    customButton.alt = 'Chatbot';
                                    customButton.className = 'custom-chatbot-icon';
                                    customButton.style.position = 'fixed';
                                    customButton.style.bottom = '16px';
                                    customButton.style.right = '16px';
                                    customButton.style.width = '60px';
                                    customButton.style.height = '60px';
                                    customButton.style.cursor = 'pointer';
                                    customButton.style.zIndex = '1000';

                                    customButton.onclick = () => {
                                        if (chatWrapper.classList.contains('expanded')) {
                                            chatWrapper.classList.remove('expanded'); // chat-wrapper에서 expanded 클래스 제거 (채팅창 닫기)
                                            console.log('Chat wrapper closed.');
                                        } else {
                                            chatWrapper.classList.add('expanded'); // chat-wrapper에 expanded 클래스 추가 (채팅창 열기)
                                            console.log('Chat wrapper expanded.');

                                            // 커스텀 버튼을 숨기고, df-messenger의 기본 버튼을 보여줌
                                            bubbleWrapper.style.visibility = 'visible'; // df-messenger 기본 버튼을 다시 보이게
                                            bubbleWrapper.style.opacity = '1';
                                        }
                                    };

                                    document.body.appendChild(customButton);
                                }
                            } else {
                                console.log('Chat wrapper not found.');
                            }
                        } else {
                            console.log('DF-MESSENGER-CHAT-BUBBLE not found or has no shadowRoot.');
                        }
                    } else {
                        console.log('chat-bubble-default-wrapper not found.');
                    }
                }
            } catch (error) {
                console.error(error.message);
            }
        };

        const checkInterval = setInterval(() => {
            console.log('Checking for df-messenger...');
            const dfMessenger = document.querySelector('df-messenger');
            if (dfMessenger) {
                applyStyles();
                clearInterval(checkInterval);
            }
        }, 500);

        return () => {
            clearInterval(checkInterval);
            console.log('Polling stopped.');
        };
    }, []);

    return (
        <>
            <style jsx global>{`
                df-messenger {
                    --df-messenger-button-image-url: none; /* 기본 버튼 이미지를 숨김 */
                }

                df-messenger .bubble {
                    background-color: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    opacity: 0 !important;
                    visibility: hidden !important; /* 기본 버튼을 완전히 숨김 */
                }
            `}</style>
            <df-messenger
                location="asia-northeast1"
                project-id="lean-ai-faq"
                agent-id="32293af4-f3fd-4102-8416-169801a34840"
                language-code="ko"
                session-persistence="false"
            ></df-messenger>
        </>
    );
}
