import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/bubble.module.css'; // 말풍선 스타일을 정의한 CSS 모듈을 import

const Chatbot = () => {
  // 상태 정의: 사용자의 입력 메시지와 채팅 메시지 목록을 관리
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', image: 'chatbot.png' },
    { sender: 'bot', text: '안녕하세요 챗봇입니다.' },
    { sender: 'bot', text: '문의하실 내용을 간단히 입력하시거나 아래 버튼을 눌러주세요.' },
    { sender: 'bot', text: '추천 검색어 ', buttons: ['추천 메뉴', '주문 조리시간', '브레이트 타임', '회장실 위치', '이벤트 확인'] }
  ]);

  // useRef를 사용하여 채팅 박스의 DOM 요소를 참조
  const chatBoxRef = useRef(null);

  // 메시지 전송 함수
  const sendMessage = () => {
    // 빈 메시지는 전송하지 않음
    if (message.trim() === '') return;

    // 사용자가 입력한 메시지를 채팅 목록에 추가
    setChatMessages(prevMessages => [
      ...prevMessages,
      { sender: 'user', text: message }
    ]);

    // 입력 필드 초기화
    setMessage('');

    // 서버로 메시지 전송 및 응답 받기
    fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message }) // 입력된 메시지를 서버로 보냄
    })
      .then(response => response.json())
      .then(data => {
        // 서버 응답을 채팅 목록에 추가
        setChatMessages(prevMessages => [
          ...prevMessages,
          { sender: 'bot', text: data.response }
        ]);
      });
  };

  // 채팅 내용이 업데이트될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-lg mx-auto bg-white border-blue-300 border p-5 rounded-lg shadow-lg font-sans mt-4 mb-2 w-10/12 h-5/6">
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

        {/* 채팅 박스: 사용자와 챗봇의 대화를 표시 */}
        <div
          className="w-full border border-gray-300 p-2 overflow-y-auto mt-4 mb-4 relative"
          id="chat-box"
          ref={chatBoxRef} // 스크롤 위치를 제어하기 위해 참조
          style={{height:'550px'}}
        >
          { /* 날짜 출력 */}
          <div className="flex flex-row items-center justify-center flex-nowrap">
            { /* 구분선 */ }
            <hr className="border-t-2 border-gray-300 my-4 w-2/5" />
            <span className="text-gray-500 mx-2 whitespace-nowrap">오늘</span>
            <hr className="border-t-2 border-gray-300 my-4 w-2/5" />
          </div>

          {chatMessages.map((msg, index) => (
            <div key={index}>
              {/* 챗봇 이미지와 소개 텍스트 */}
              {msg.image ? (
                <div className="flex flex-col items-center mb-2 ">
                  <img src={msg.image} alt="Chatbot" className="w-20 h-20 object-fill mt-2 bg-yellow-300 rounded-full" />
                  <p className="text-center mb-3 font-semibold" style={{ whiteSpace: 'pre-line' }}>
                  {`무물 떡볶이에 대해 
                  무엇이 궁금하신가요?`}
                  </p>
                </div>
              ) : (
                <div className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
                  {/* 사용자와 챗봇의 말풍선 스타일을 CSS 모듈로 관리 */}
                  <div className={styles[msg.sender === 'user' ? 'user-bubble' : 'bot-bubble']}>
                    {msg.text}
                  </div>

                  {/* 챗봇의 버튼 목록을 렌더링 */}
                  {msg.buttons && (
                    <div className="flex flex-wrap justify-center items-center bg-transparent">
                      {msg.buttons.map((buttonText, buttonIndex) => (
                        <button key={buttonIndex} className="text-white bg-blue-300 rounded-lg mx-1 mb-2 px-1 w-28 h-12">
                          {buttonText}
                        </button>
                      ))}
                    </div>
                  )}
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
            value={message} // 사용자의 입력 값을 바인딩
            onChange={(e) => setMessage(e.target.value)} // 입력값 변경 시 상태 업데이트
            placeholder="메시지를 입력해주세요!" // 입력 필드의 플레이스홀더
          />
          <button
            onClick={sendMessage} // 버튼 클릭 시 메시지 전송
            className="flex items-center justify-center p-2 rounded text-white"
          >
            {/* 전송 버튼에 이미지 아이콘 사용 */}
            <img src="send.png" alt="Send" className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
