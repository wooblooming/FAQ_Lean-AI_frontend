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
                                bubbleButton.style.visibility = 'hidden';
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
                                    customButton.style.backgroundColor = 'rgb(253 224 71)';
                                    customButton.style.position = 'fixed';
                                    customButton.style.bottom = '20px';
                                    customButton.style.right = '20px';
                                    customButton.style.width = '60px';
                                    customButton.style.borderRadius = '50%';
                                    customButton.style.height = '60px';
                                    customButton.style.cursor = 'pointer';
                                    customButton.style.zIndex = '1000';

                                    const clickMeText = document.createElement('p');
                                    clickMeText.innerText = 'Click Me';
                                    clickMeText.style.position = 'fixed';
                                    clickMeText.style.bottom = '85px';
                                    clickMeText.style.right = '25px';
                                    clickMeText.style.color = 'black';
                                    clickMeText.style.fontWeight = 'bold';
                                    clickMeText.style.fontSize = '14px';
                                    clickMeText.style.zIndex = '1001';
                                    clickMeText.style.animation = 'sparkleText 2.5s infinite';

                                    customButton.onclick = () => {
                                        if (chatWrapper.classList.contains('expanded')) {
                                            chatWrapper.classList.remove('expanded');
                                            console.log('Chat wrapper closed.');
                                        } else {
                                            chatWrapper.classList.add('expanded');
                                            console.log('Chat wrapper expanded.');
                                            bubbleWrapper.style.visibility = 'visible';
                                            bubbleWrapper.style.opacity = '1';
                                        }
                                    };

                                    document.body.appendChild(customButton);
                                    document.body.appendChild(clickMeText);
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
                    --df-messenger-button-image-url: none;
                    --df-messenger-font-color: #000;
                    --df-messenger-chat-background: #f3f6fc;
                    --df-messenger-message-user-background: #d3e3fd;
                    --df-messenger-message-bot-background: #fff;
                    --df-messenger-chat-window-width : 380px;
                }

                df-messenger .bubble {
                    background-color: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    opacity: 0 !important;
                    visibility: hidden !important;
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
            <df-messenger
                location="asia-northeast1"
                project-id="lean-ai-faq"
                agent-id="6b189043-1000-4cb8-aa3a-9adbe4aa02df"
                language-code="ko"
                session-persistence="false"
            ></df-messenger>
        </>
    );
}
