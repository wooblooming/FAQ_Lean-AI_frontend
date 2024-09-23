import React, { useState, useEffect } from 'react';

const ChatAnimation = () => {
  const [messages, setMessages] = useState([]);
  const [isClient, setIsClient] = useState(false); // 클라이언트 측에서만 렌더링하는 플래그

  const chatMessages = [
    { sender: 'AI', text: '안녕하세요! 무엇을 도와드릴까요?' },
    { sender: 'User', text: '챗봇 서비스에 대해 알고 싶어요.' },
    { sender: 'AI', text: '저희 AI 챗봇은 고객 응대, 매출 최적화 솔루션을 제공합니다.' },
    { sender: 'User', text: '어떻게 사용하죠?' },
    { sender: 'AI', text: '간단히 API를 통해 통합하고, 실시간으로 고객과 소통할 수 있습니다.' },
    { sender: 'User', text: '더 자세히 알고 싶어요!' },
    { sender: 'AI', text: '문의 주시면 친절하게 안내해드리겠습니다.' }
  ];

  // 클라이언트에서만 상태 업데이트
  useEffect(() => {
    setIsClient(true); // 클라이언트에서만 렌더링 시작
    let index = 0;
    if (isClient) {
      const interval = setInterval(() => {
        if (index < chatMessages.length) {
          setMessages((prevMessages) => [...prevMessages, chatMessages[index]]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 3000); // 3초 간격으로 메시지 추가
      return () => clearInterval(interval);
    }
  }, [isClient]);

  if (!isClient) {
    // 클라이언트에서만 렌더링하도록 방어 코드 추가
    return null;
  }

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-bubble ${msg.sender === 'AI' ? 'ai' : 'user'}`}
            style={{ animationDelay: `${index * 0.5}s` }}
          >
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .chat-container {
          width: 350px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .chat-box {
          display: flex;
          flex-direction: column;
          gap: 15px;
          overflow-y: auto;
          height: 300px;
          padding: 10px;
          border-radius: 10px;
        }

        .chat-bubble {
          max-width: 80%;
          padding: 12px 18px;
          border-radius: 20px;
          font-size: 14px;
          opacity: 0;
          animation: fadeInUp 0.8s forwards;
        }

        .ai {
          background-color: #e0f7fa;
          align-self: flex-start;
        }

        .user {
          background-color: #d1c4e9;
          align-self: flex-end;
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatAnimation;
