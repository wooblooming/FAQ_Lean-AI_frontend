import React, { useEffect, useState } from 'react';

export default function Chatbot({ agentId }) {
  // 세션 ID 상태
  const [sessionId, setSessionId] = useState(null);

  /**
   * 세션 생성 및 초기화 로직
   */
  useEffect(() => {
    const createNewSession = () => {
      // 고유한 session ID 생성
      const newSessionId = `session-${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);

      // 챗봇 요소에 세션 적용
      const dfMessenger = document.querySelector('df-messenger');
      sessionStorage.removeItem('greeted'); // 새 세션에서는 greeted 상태 초기화

      if (dfMessenger) {
        dfMessenger.setAttribute('session-id', newSessionId);
        if (typeof dfMessenger.startNewSession === 'function') {
          dfMessenger.startNewSession({ retainHistory: false });
        }
      }
    };

    createNewSession(); // 최초 로딩 시 세션 생성

    // 새로고침 시 세션 재생성
    const handlePageRefresh = () => {
      createNewSession();
      sessionStorage.removeItem('greeted');
    };

    // 챗봇 열림 감지 이벤트 (greeting 메시지 전송)
    const handleChatOpenChanged = (event) => {
      const dfMessenger = document.querySelector('df-messenger');

      if (event.detail.isOpen && dfMessenger) {
        createNewSession(); // 새 세션 생성

        const sendGreetingMessage = () => {
          if (!sessionStorage.getItem('greeted')) {
            try {
              dfMessenger.sendQuery('안녕'); // 최초 인사 메시지
              sessionStorage.setItem('greeted', 'true');
            } catch (error) {
              console.error('Error sending greeting message:', error);
            }
          }
        };

        // 로딩 상태에 따라 인사 메시지 전송 타이밍 조절
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

    // 이벤트 등록
    window.addEventListener('beforeunload', handlePageRefresh);
    window.addEventListener('df-chat-open-changed', handleChatOpenChanged);

    // 언마운트 시 이벤트 제거
    return () => {
      window.removeEventListener('beforeunload', handlePageRefresh);
      window.removeEventListener('df-chat-open-changed', handleChatOpenChanged);
    };
  }, [agentId]);

  /**
   * 챗봇 내부 스타일 커스터마이징
   */
  useEffect(() => {
    const applyCustomStyle = () => {
      const chatBubble = document.querySelector("#__next > div > div > div:nth-child(5) > df-messenger > df-messenger-chat-bubble");

      // shadow DOM 내부 접근하여 스타일 수정
      if (chatBubble && chatBubble.shadowRoot) {
        const titleBar = chatBubble.shadowRoot.querySelector("#df-chat-wrapper > df-messenger-titlebar");

        if (titleBar && titleBar.shadowRoot) {
          const actionsElement = titleBar.shadowRoot.querySelector("div > div.actions");
          if (actionsElement) {
            actionsElement.style.mixBlendMode = 'plus-lighter'; // 시각 효과용 blend 모드
          }
        }
      }
    };

    // 챗봇이 DOM에 렌더된 후 스타일 적용
    setTimeout(applyCustomStyle, 1000);
  }, []);

  /**
   * 챗봇이 응답을 보내는 중이라는 메시지 보여주기
   */
  useEffect(() => {
    const dfMessenger = document.querySelector('df-messenger');

    const handleRequestSent = () => {
      if (dfMessenger) {
        dfMessenger.sendQuery('응답을 생성중입니다 잠시만 기다려주세요!');
      }
    };

    if (dfMessenger) {
      dfMessenger.addEventListener('df-request-sent', handleRequestSent);
    }

    return () => {
      if (dfMessenger) {
        dfMessenger.removeEventListener('df-request-sent', handleRequestSent);
      }
    };
  }, []);

  return (
    <div>
      {sessionId && (
        <df-messenger
          project-id="lean-ai-faq"
          agent-id={agentId}
          language-code="ko"
          enable-speech-input="true"
          enable-speech-output="true"
          enable-speech-input-language="ko"
          enable-speech-output-language="ko"
          session-id={sessionId}
          session-persistence="true"
          style={{
            zIndex: '30',
            position: 'fixed',
            bottom: '20px',
            right: '5px',
            // ↓ 아래는 모두 CSS 변수 커스텀 (Dialogflow 스타일 덮어쓰기)
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
            chat-title-icon="/images/mumul.png"
            chat-title="MUMUL BOT"
            placeholder-text="자유롭게 질문해주세요"
            bot-actor-image="/images/chatbot.png"
            bot-writing-text="응답을 생성중입니다. 잠시만 기다려주세요😊"
            allow-fullscreen="always"
            enable-speech-input="true"
            enable-speech-output="true"
            enable-speech-input-language="ko"
            enable-speech-output-language="ko"
          ></df-messenger-chat-bubble>
        </df-messenger>
      )}
    </div>
  );
}
