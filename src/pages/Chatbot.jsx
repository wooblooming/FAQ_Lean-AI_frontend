import React, { useState, useRef } from 'react';
import '../bubble.css'; {/* 말풍선 CSS를 import */}

const Chatbot = () => {
  {/* useState : 가변적인 상태를 지니고 있을 수 있게 해 줌 */ }
  const [message, setMessage] = useState('');

  {/* useRef : 랜더링 시 내부 변수 유지할 수 있게 해줌 */ }
  const chatBoxRef = useRef(null);

  {/* 메시지 전송 */ }
  const sendMessage = () => {
    {/* 공백일 경우 */ }
    if (message.trim() === "") return; 

    {/* 채팅 박스에 고객의 메시지 내용 출력 */ }
    if (chatBoxRef.current) {
      chatBoxRef.current.innerHTML += `
        <div class="text-right">
          <div class="user-bubble"><strong>You:</strong> ${message}</div>
        </div>
      `;
    }

    {/* 메시지 전송 창 clear */ }
    setMessage('');

    {/* AI 챗봇 응답 가져오기 */ }
    fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    })
      .then(response => response.json())
      .then(data => {
        {/* 채팅 박스에 챗봇의 응답 메시지 내용 출력 */ }
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
    <div className="max-w-lg mx-auto bg-white border-blue-300 border p-5 rounded-lg shadow-lg font-sans mt-6"> {/* className은 css 설정 내용*/}
      {/* 챗봇 이미지 */}
      <img src="chatbot.png" alt="Chatbot" className="w-24 h-24 object-cover mx-auto mb-4" />

      {/* 인사 멘트 출력 */}
      <p className="text-center mb-2">안녕하세요 찬혁 떡볶이입니다!<br />
        찬혁 떡볶이에 대해 무엇이 궁금하신가요?
      </p>

      {/* 채팅 박스 */}
      <div
        className="w-full h-72 border border-gray-300 p-2 overflow-y-auto mb-4"
        id="chat-box"
        ref={chatBoxRef}
      >

      </div>

      {/* 메시지 창 */}
      <div className="flex justify-between">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded mr-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="무엇이든 물어보세요!"
        />

      {/* 메시지 전송 버튼 */}
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

export default Chatbot;
