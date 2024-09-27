import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QRChatAnimation = () => {
  console.log('QRChatAnimation rendering');
  const [step, setStep] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    console.log('QRChatAnimation mounted, current step:', step);
    const timer = setTimeout(() => {
      if (step < 3) {
        setStep(step + 1);
      } else if (chatMessages.length < 2) {
        setChatMessages(prev => [...prev, { text: chatMessages.length === 0 ? "안녕하세요! 무엇을 도와드릴까요?" : "네, 어떤 정보가 필요하신가요?", isBot: true }]);
      }
    }, step < 3 ? 2000 : 1500);

    return () => clearTimeout(timer);
  }, [step, chatMessages]);

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
  };

  return (
    <div className="relative w-80 h-120 bg-gray-100 rounded-lg overflow-hidden shadow-lg border-2 border-blue-500">
      <div className="absolute top-0 left-0 bg-black text-white p-1 z-10">Step: {step}</div>
      <AnimatePresence mode="wait">
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
              <p>QR Code Placeholder</p>
            </div>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div
            key="scan"
            className="absolute inset-0 flex items-center justify-center"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
          >
            <motion.div
              className="w-64 h-1 bg-blue-500"
              animate={{ y: [-100, 100], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <div className="w-48 h-48 border-4 border-blue-500 rounded-lg" />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="loading"
            className="absolute inset-0 flex items-center justify-center"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
          >
            <motion.div
              className="w-16 h-16 border-t-4 border-blue-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
        {step >= 3 && (
          <motion.div
            key="chat"
            className="absolute inset-0 flex flex-col"
            initial="hidden"
            animate="visible"
            variants={variants}
          >
            <div className="bg-blue-500 text-white p-4">
              <h3 className="text-lg font-bold">AI 챗봇</h3>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
              <AnimatePresence>
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mb-2 p-2 rounded ${msg.isBot ? 'bg-gray-200 mr-8' : 'bg-blue-100 ml-8'}`}
                  >
                    {msg.text}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="p-4 bg-white border-t">
              <input
                type="text"
                placeholder="메시지를 입력하세요..."
                className="w-full p-2 rounded border"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim() !== '') {
                    setChatMessages(prev => [...prev, { text: e.target.value, isBot: false }]);
                    e.target.value = '';
                  }
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QRChatAnimation;