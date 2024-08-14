import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/bubble.module.css'; // 말풍선 스타일을 정의한 CSS 모듈을 import

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: '안녕하세요 챗봇입니다.' },
    { sender: 'bot', text: '문의하실 내용을 간단히 입력하시거나 아래 버튼을 눌러주세요.' },
    { sender: 'bot', text: '추천 검색어 ', buttons: ['추천 검색어 1', '추천 검색어 2', '추천 검색어 3'] }
  ]);
  const chatBoxRef = useRef(null);

  const sendMessage = () => {
    if (message.trim() === '') return;

    setChatMessages(prevMessages => [
      ...prevMessages,
      { sender: 'user', text: message }
    ]);

    setMessage('');

    fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    })
      .then(response => response.json())
      .then(data => {
        setChatMessages(prevMessages => [
          ...prevMessages,
          { sender: 'bot', text: data.response }
        ]);
      });
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-lg mx-auto bg-white border-blue-300 border p-5 rounded-lg shadow-lg font-sans mt-4 mb-2 w-10/12 h-3/6">
        {/* 뒤로가기 버튼과 타이틀을 같은 줄에 배치 */}
        <div className="flex items-center justify-between mb-2">
          <a href="/storeIntroduction" className="text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          {/* 챗봇 타이틀을 가운데에 배치 */}
          <h1 className="text-4xl font-bold text-center flex-grow">MUMUL</h1>
        </div>

        <div className="flex flex-col items-center mb-2">
        {/* 챗봇 이미지 */}
          <img src="chatbot.png" alt="Chatbot" className="w-28 h-28 object-fill" />
          <p className="text-center mt-2 mb-2 font-semibold ">찬혁 떡볶이에 대해 무엇이 궁금하신가요?
          </p>
        </div>

        {/* 채팅 박스 */}
        <div
          className="w-full h-72 border border-gray-300 p-2 overflow-y-auto mb-4 relative"
          id="chat-box"
          ref={chatBoxRef}
        >
          {chatMessages.map((msg, index) => (
            <div key={index} className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
              <div className={styles[msg.sender === 'user' ? 'user-bubble' : 'bot-bubble']}>
                {msg.text}
              </div>
              {msg.buttons && (
                <div className="flex flex-row justify-center items-center bg-transparent">
                  {msg.buttons.map((buttonText, buttonIndex) => (
                    <button key={buttonIndex} className="text-white bg-blue-300 rounded-lg mx-1 mb-2 px-1 w-fit">
                      {buttonText}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 메시지 입력 필드와 전송 버튼 */}
        <div className="flex justify-between">
          <input
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded mr-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="무엇이든 물어보세요!"
          />
          <button
            onClick={sendMessage}
            className="flex items-center justify-center p-2 rounded text-white"
          >
            <img src="send.png" alt="Send" className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
