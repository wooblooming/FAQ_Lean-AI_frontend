import React, { useState, useRef } from 'react';
import styles from '../styles/bubble.module.css'; // 말풍선 CSS 모듈을 import

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const chatBoxRef = useRef(null);

  const sendMessage = () => {
    if (message.trim() === "") return;

    if (chatBoxRef.current) {
      chatBoxRef.current.innerHTML += `
        <div class="text-right">
          <div class="${styles['user-bubble']}"><strong>You:</strong> ${message}</div>
        </div>
      `;
    }

    setMessage('');

    fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    })
      .then(response => response.json())
      .then(data => {
        if (chatBoxRef.current) {
          chatBoxRef.current.innerHTML += `
            <div class="text-left">
              <div class="${styles['bot-bubble']}"><strong>Bot:</strong> ${data.response}</div>
            </div>
          `;
        }
      });
  };

  return (
    <div className="max-w-lg mx-auto bg-white border-blue-300 border p-5 rounded-lg shadow-lg font-sans mt-6">
      {/* 뒤로가기 기능 */}
      <div className="flex items-center mb-4">
        <a href="/storeIntroduce" className="text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </a>
      </div>
      <h1 className="text-4xl font-bold text-center mb-2">LEAN AI</h1>
      <img src="chatbot.png" alt="Chatbot" className="w-32 h-32 object-cover mx-auto mb-2" />
      <p className="text-center mb-2">안녕하세요 찬혁 떡볶이입니다!<br />
        찬혁 떡볶이에 대해 무엇이 궁금하신가요?
      </p>
      <div
        className="w-full h-72 border border-gray-300 p-2 overflow-y-auto mb-4"
        id="chat-box"
        ref={chatBoxRef}
      >
      </div>
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
  );
};

export default Chatbot;
