import React, { useEffect, useState } from 'react';

export default function Chatbot({ agentId }) {
    const [sessionId, setSessionId] = useState(null);

    useEffect(() => {
        const newSessionId = `session-${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(newSessionId);

        const resetSession = () => {
            const dfMessenger = document.querySelector('df-messenger');
            if (dfMessenger) {
                dfMessenger.setAttribute('session-id', newSessionId);
                if (typeof dfMessenger.startNewSession === 'function') {
                    dfMessenger.startNewSession({ retainHistory: false });
                }
            }
        };

        setTimeout(resetSession, 500);

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
                    --df-messenger-chat-bubble-background: #fde047;
                }

                /* 기본 채팅창 크기 */
                df-messenger {
                    --df-messenger-chat-window-width: 500%
                }

                /* 디바이스 크기 */
                @media (min-width: 300px) {
                    df-messenger {
                        --df-messenger-chat-window-width: 450%;
                        --df-messenger-chat-window-height: 800%;
                    }
                }
                @media (min-width: 370px) {
                    df-messenger {
                        --df-messenger-chat-window-width: 500%;
                        --df-messenger-chat-window-height: 830%;
                    }
                }
                @media (min-width: 400px) {
                    df-messenger {
                        --df-messenger-chat-window-width: 550%;
                        --df-messenger-chat-window-height: 900%;
                    }
                }
                @media (min-width: 500px) {
                    df-messenger {
                        --df-messenger-chat-window-width: 600%;
                        --df-messenger-chat-window-height: 900%;
                        --df-messenger-font-size: 16px;
                    }
                }
                @media (min-width: 600px) {
                    df-messenger {
                        --df-messenger-chat-window-width: 550%;
                        --df-messenger-chat-window-height: 900%;
                        --df-messenger-font-size: 25px;
                    }
                }
                @media (min-width: 700px) {
                    df-messenger {
                        --df-messenger-chat-window-width: 850%;
                        --df-messenger-chat-window-height: 1180%;
                    }
                }
                @media (min-width: 800px) {
                    df-messenger {
                        --df-messenger-chat-window-width: 900%;
                        --df-messenger-chat-window-height: 1300%;
                        --df-messenger-font-size: 30px;
                    }
                }
                @media (min-width: 900px) {
                    df-messenger {
                        --df-messenger-chat-window-width: 950%;
                        --df-messenger-chat-window-height: 1460%;
                    }
                }
                @media (min-width: 1000px) {
                    @media (min-height: 500px) {
                        df-messenger {
                            --df-messenger-chat-window-width: 1100%;
                            --df-messenger-chat-window-height: 690%;
                            --df-messenger-font-size: 20px;
                        }
                    }
                    @media (min-height: 600px) {
                        df-messenger {
                            --df-messenger-chat-window-width: 1100%;
                            --df-messenger-chat-window-height: 750%;
                            --df-messenger-font-size: 20px;
                        }
                    }
                    @media (min-height: 700px) {
                        df-messenger {
                            --df-messenger-chat-window-width: 1100%;
                            --df-messenger-chat-window-height: 850%;
                            --df-messenger-font-size: 20px;
                        }
                    }

                    @media (min-height: 800px) {
                        df-messenger {
                            --df-messenger-chat-window-width: 1100%;
                            --df-messenger-chat-window-height: 1000%;
                            --df-messenger-font-size: 20px;
                        }
                    }
                }
            `}</style>
        </>
    );
}
