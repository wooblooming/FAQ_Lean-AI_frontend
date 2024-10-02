import React, { useState, useEffect } from 'react';
import Loading from './loading';
import { motion, AnimatePresence } from 'framer-motion';

const QRChatAnimation = () => {
  const [step, setStep] = useState(0); // 애니메이션 단계
  const [chatMessages, setChatMessages] = useState([]); // 챗봇 메시지 리스트

  // Chips 데이터를 배열로 저장
  const [chips] = useState([
    { id: 1, label: '추천 메뉴' },
    { id: 2, label: '주문 조리시간' },
    { id: 3, label: '운영 시간(Break Time)' },
    { id: 4, label: '화장실 위치' },
    { id: 5, label: '이벤트 확인' }
  ]);

  // 애니메이션 단계 및 메시지 업데이트
  useEffect(() => {
    console.log(`Current step: ${step}`);
    const timer = setTimeout(() => {
      if (step < 3) {
        setStep(step + 1);
      } else if (chatMessages.length < 4) {
        setChatMessages(prev => [
          ...prev,
          { type: 'image', url: '/index_chatbot_img.png', isBot: true }, // 이미지 메시지 추가
          { text: '안녕하세요! 무물봇입니다!', isBot: true },
          { text: `문의하실 내용을 간단히 입력하시거나 ${<br/>} 아래의 버튼을 눌러주세요`, isBot: true },
          { type: 'chips', isBot: true } // Chips 메시지 추가
        ]);
      }
    }, step < 3 ? 2000 : 1500);

    return () => clearTimeout(timer);
  }, [step, chatMessages]);

  // 애니메이션 변형 설정
  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
  };

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden shadow-lg ">
      {/* 애니메이션 단계별 렌더링 */}
      <AnimatePresence mode="wait">
        {/* QR 코드 단계 */}
        {step === 0 && (
          <motion.div
            key="qr"
            className="absolute inset-0 flex items-center justify-center bg-white"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
          >
            <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
              <img src="/qr_code.png" alt="qr code" className="w-full h-full object-contain" />
            </div>
          </motion.div>
        )}

        {/* 로딩 스피너 단계 */}
        {step === 1 && (
          <motion.div
            key="loading"
            className="absolute inset-0 flex items-center justify-center"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
          >
            <Loading />
          </motion.div>
        )}

        {/* 챗봇 대화창 단계 */}
        {step >= 2 && (
          <motion.div
            key="chat"
            className="absolute inset-0 flex flex-col"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
          >
            {/* 챗봇 헤더 */}
            <div className="bg-indigo-500 text-white p-4">
              <h3 className="text-lg font-bold">MUMUL BOT</h3>
            </div>

            {/* 챗봇 메시지 리스트 */}
            <div className="flex-grow p-4">
              <AnimatePresence>
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mb-2 p-2 rounded whitespace-pre-line ${msg.isBot ? 'bg-white mr-8' : 'bg-blue-100 ml-8'}`}
                  >
                    {/* 메시지가 Chips 타입인 경우 */}
                    {msg.type === 'chips' ? (
                      <div className="flex flex-wrap gap-2">
                        {chips.map((chip) => (
                          <button
                            key={chip.id}
                            className="px-4 py-2 rounded-full bg-white border border-blue-400 text-gray-700  transition"
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>
                    ) : msg.type === 'image' ? (
                      <img src={msg.url} alt="bot-img" className="h-1/3 object-contain" />
                    ) : (
                      msg.text
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QRChatAnimation;
