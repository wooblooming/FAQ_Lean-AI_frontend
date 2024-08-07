// src/ChatbotPage.js
import React, { useState, useRef } from 'react';
import './bubble.css'; // 말풍선 CSS를 import 합니다.

const ChatbotPage = () => {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const chatBoxRef = useRef(null);

  const sendMessage = () => {
    if (message.trim() === "") return;

    // Update chat history with user's message
    setHistory(prevHistory => [
      ...prevHistory,
      { message: message, response: "" }
    ]);

    // Display user's message in the chat box
    if (chatBoxRef.current) {
      chatBoxRef.current.innerHTML += `
        <div class="text-right">
          <div class="user-bubble"><strong>You:</strong> ${message}</div>
        </div>
      `;
    }

    // Clear the input field
    setMessage('');

    // Fetch response from the server
    fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    })
      .then(response => response.json())
      .then(data => {
        // Update chat history with bot's response
        setHistory(prevHistory => {
          const updatedHistory = [...prevHistory];
          updatedHistory[updatedHistory.length - 1].response = data.response;
          return updatedHistory;
        });

        // Display bot's response in the chat box
        if (chatBoxRef.current) {
          chatBoxRef.current.innerHTML += `
            <div class="text-left">
              <div class="bot-bubble"><strong>Bot:</strong> ${data.response}</div>
            </div>
          `;
        }
      });
  };

  return (
    <div className="max-w-lg mx-auto bg-white border-blue-300 border p-5 rounded-lg shadow-lg font-sans">
      <img src="chatbot.png" alt="Chatbot" className="w-24 h-24 object-cover mx-auto mb-4" />
      <p className="text-center mb-2">안녕하세요 찬혁 떡볶이입니다!<br />
        찬혁 떡볶이에 대해 무엇이 궁금하신가요?
      </p>
      <div
        className="w-full h-72 border border-gray-300 p-2 overflow-y-auto mb-4"
        id="chat-box"
        ref={chatBoxRef}
      ></div>
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
          className="flex items-center justify-center p-2 rounded hover:bg-blue-600 text-white"
        >
          <img src="send.png" alt="Send" className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};

export default ChatbotPage;