import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/bubble.module.css'; // 말풍선 스타일을 정의한 CSS 모듈을 import

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', image: 'chatbot.png' },
    { sender: 'bot', text: '안녕하세요 챗봇입니다.' },
    { sender: 'bot', text: '문의하실 내용을 간단히 입력하시거나 아래 버튼을 눌러주세요.' },
    { sender: 'bot', text: '추천 검색어 ', buttons: ['추천 메뉴', '주문 조리시간', '브레이트 타임', '회장실 위치', '이벤트 확인'] }
  ]);

  const chatBoxRef = useRef(null);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    setChatMessages(prevMessages => [
      ...prevMessages,
      { sender: 'user', text: message }
    ]);

    setMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8000/chatbot/chating/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message }) 
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setChatMessages(prevMessages => [
        ...prevMessages,
        { sender: 'bot', text: data.response }
      ]);

    } catch (error) {
      if (error.name === 'TypeError') {
        console.error('There was a problem with the fetch operation:', error);
        setChatMessages(prevMessages => [
          ...prevMessages,
          { sender: 'bot', text: '네트워크 문제로 인해 요청을 처리할 수 없습니다. 다시 시도해주세요.', error: true }
        ]);
      } else if (error.message.startsWith('HTTP error')) {
        console.error('Server returned an error:', error);
        setChatMessages(prevMessages => [
          ...prevMessages,
          { sender: 'bot', text: `서버에서 오류가 발생했습니다. 상태 코드: ${error.message.split(': ')[1]}`, error: true }
        ]);
      } else {
        console.error('Unexpected error:', error);
        setChatMessages(prevMessages => [
          ...prevMessages,
          { sender: 'bot', text: '예기치 않은 오류가 발생했습니다. 다시 시도해주세요.', error: true }
        ]);
      }
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-lg mx-auto bg-white border-blue-300 border p-5 rounded-lg shadow-lg font-sans mt-4 mb-2 w-10/12 h-5/6">
        <div className="flex items-center justify-between mb-2">
          <a href="/storeIntroduction" className="text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <h1 className="text-4xl font-bold text-center flex-grow">MUMUL</h1>
        </div>

        <div
          className="w-full border border-gray-300 p-2 overflow-y-auto mt-4 mb-4 relative font-sans text-base"
          id="chat-box"
          ref={chatBoxRef}
          style={{height:'550px'}}
        >
          <div className="flex flex-row items-center justify-center flex-nowrap">
            <hr className="border-t-2 border-gray-300 my-4 w-2/5" />
            <span className="text-gray-500 mx-2 whitespace-nowrap">오늘</span>
            <hr className="border-t-2 border-gray-300 my-4 w-2/5" />
          </div>

          {chatMessages.map((msg, index) => (
            <div key={index}>
              {msg.image ? (
                <div className="flex flex-col items-center mb-2 ">
                  <img src={msg.image} alt="Chatbot" className="w-20 h-20 object-fill mt-2 bg-yellow-300 rounded-full" />
                  <p className="text-center mb-3 font-semibold text-2xl mt-2" style={{ whiteSpace: 'pre-line' }}>
                  {`무물 떡볶이에 대해 
                  무엇이 궁금하신가요?`}
                  </p>
                </div>
              ) : (
                <div className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
                  <div
                    className={`${styles[msg.error ? 'error-bubble' : msg.sender === 'user' ? 'user-bubble' : 'bot-bubble']}`}
                  >
                    {msg.text}
                  </div>

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

        <div className="flex justify-between">
          <input
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded mr-2 text-base"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력해주세요!"
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
