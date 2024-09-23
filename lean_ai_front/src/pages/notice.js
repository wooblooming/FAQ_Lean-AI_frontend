import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Bell, RefreshCw, Shield, ArrowLeft } from 'lucide-react';

const AnnouncementPage = () => {
  const [selectedId, setSelectedId] = useState(null);

  const announcements = [
    { 
      id: 1, 
      title: "린에이아이 서비스 런칭 및 POC 진행 안내", 
      date: "2024. 09. 20",
      content: "저희는 AI 기반 소상공인 고객 응대 솔루션을 공식적으로 런칭했습니다! 현재 POC(Proof of Concept) 단계로, 초기 도입 기업들을 대상으로 서비스의 효율성과 가치를 입증하고 있습니다.",
      icon: Bell
    },
    { 
      id: 2, 
      title: "신규 기능 업데이트: AI 응답 개선", 
      date: "2024. 09. 15",
      content: "AI 응답의 정확도와 자연스러움을 크게 향상시켰습니다. 이번 업데이트로 고객 만족도가 20% 이상 증가할 것으로 예상됩니다.",
      icon: RefreshCw
    },
    { 
      id: 3, 
      title: "9월 시스템 점검 안내", 
      date: "2024. 09. 10",
      content: "9월 15일 새벽 2시부터 4시까지 시스템 점검이 예정되어 있습니다. 해당 시간 동안 서비스 이용이 제한될 수 있습니다.",
      icon: Calendar
    },
    { 
      id: 4, 
      title: "개인정보 처리방침 개정 안내", 
      date: "2024. 09. 05",
      content: "개인정보 보호법 개정에 따라 당사의 개인정보 처리방침이 일부 변경되었습니다. 자세한 내용은 공지사항을 확인해 주세요.",
      icon: Shield
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-12"> {/* 추가된 부분 */}
          <ArrowLeft className="h-6 w-6 text-purple-600 cursor-pointer mr-2" onClick={() => window.history.back()} /> {/* 뒤로가기 아이콘 */}
          <h1 className="text-4xl font-bold text-purple-800 text-center">공지사항</h1>
        </div>
        <div className="relative">
          {announcements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              className="mb-8 flex"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex flex-col items-center mr-4">
                <div className={`rounded-full p-3 ${selectedId === announcement.id ? 'bg-purple-600' : 'bg-white'} shadow-lg`}>
                  <announcement.icon className={`h-6 w-6 ${selectedId === announcement.id ? 'text-white' : 'text-purple-600'}`} />
                </div>
                <div className="h-full w-0.5 bg-purple-300 mt-3"></div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 flex-grow cursor-pointer hover:shadow-lg transition-shadow duration-200"
                   onClick={() => setSelectedId(selectedId === announcement.id ? null : announcement.id)}>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{announcement.title}</h2>
                <p className="text-sm text-purple-600 mb-4">{announcement.date}</p>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: selectedId === announcement.id ? 'auto' : 0,
                    opacity: selectedId === announcement.id ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-700">{announcement.content}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementPage;