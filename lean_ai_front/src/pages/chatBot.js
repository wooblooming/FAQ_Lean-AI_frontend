import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/bubble.module.css'; // 말풍선 스타일을 정의한 CSS 모듈을 import

const Chatbot = () => {
  // 사용자 입력 메시지를 관리하는 상태
  const [message, setMessage] = useState('');
  // 채팅 메시지를 관리하는 상태
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: '안녕하세요 챗봇입니다.' },
    { sender: 'bot', text: '문의하실 내용을 간단히 입력하시거나 아래 버튼을 눌러주세요.' },
    { sender: 'bot', text: '추천 검색어 ', buttons: ['추천 검색어 1', '추천 검색어 2', '추천 검색어 3'] } // 추천 검색어 버튼 추가
  ]);
  // 채팅 박스 스크롤 처리를 위한 ref
  const chatBoxRef = useRef(null);

  // 사용자가 메시지를 전송했을 때 호출되는 함수
  const sendMessage = () => {
    if (message.trim() === '') return; // 메시지가 비어있다면 전송하지 않음

    // 사용자가 입력한 메시지를 채팅에 추가
    setChatMessages(prevMessages => [
      ...prevMessages,
      { sender: 'user', text: message }
    ]);

    setMessage(''); // 입력 필드 초기화

    // 서버로 메시지 전송
    fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message }) // 메시지를 JSON으로 변환하여 전송
    })
      .then(response => response.json()) // 서버 응답을 JSON으로 변환
      .then(data => {
        // 서버에서 응답받은 메시지를 채팅에 추가
        setChatMessages(prevMessages => [
          ...prevMessages,
          { sender: 'bot', text: data.response }
        ]);
      });
  };

  // 새로운 메시지가 추가될 때마다 스크롤을 아래로 이동시키는 효과
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight; // 채팅 박스 스크롤을 가장 아래로 설정
    }
  }, [chatMessages]);

  return (
    <div className="max-w-lg mx-auto bg-white border-blue-300 border p-5 rounded-lg shadow-lg font-sans mt-6 mb-4 w-1/3">
      {/* 뒤로가기 기능 */}
      <div className="flex items-center mb-2">
        <a href="/storeIntroduction" className="text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </a>
      </div>
      {/* 챗봇 타이틀 */}
      <h1 className="text-4xl font-bold text-center">LEAN AI</h1>
      {/* 챗봇 이미지 */}
      <img src="chatbot.png" alt="Chatbot" className="w-32 h-32 object-cover mx-auto" />
      {/* 안내 메시지 */}
      <p className="text-center mb-2 font-semibold">찬혁 떡볶이에 대해 무엇이 궁금하신가요?</p>

      {/* 채팅 박스 */}
      <div
        className="w-full h-60 border border-gray-300 p-2 overflow-y-auto mb-4 relative"
        id="chat-box"
        ref={chatBoxRef} // 채팅 박스를 참조
      >
        {chatMessages.map((msg, index) => (
          <div key={index} className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
            {/* 메시지를 보여주는 말풍선 */}
            <div className={styles[msg.sender === 'user' ? 'user-bubble' : 'bot-bubble']}>
              {msg.text}
            </div>
            {/* 버튼이 있는 메시지의 경우 버튼 렌더링 */}
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
          value={message} // 입력된 메시지를 상태로 관리
          onChange={(e) => setMessage(e.target.value)} // 입력 필드가 변경될 때 상태 업데이트
          placeholder="무엇이든 물어보세요!" // 입력 필드에 표시되는 플레이스홀더
        />
        <button
          onClick={sendMessage} // 전송 버튼 클릭 시 메시지 전송 함수 호출
          className="flex items-center justify-center p-2 rounded text-white"
        >
          <img src="send.png" alt="Send" className="w-7 h-7" /> {/* 전송 아이콘 */}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
