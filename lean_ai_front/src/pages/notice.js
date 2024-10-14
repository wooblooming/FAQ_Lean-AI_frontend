import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Calendar, Bell, ArrowLeft } from 'lucide-react';

// 공지사항 데이터를 외부에서 사용할 수 있도록 내보내기
export const announcements = [
  { 
    id: 1, 
    title: "린에이아이 서비스 런칭 및 POC 진행 안내", 
    date: "2024. 09. 20",
    content: `저희는 AI 기반 소상공인 고객 응대 솔루션을 공식적으로 런칭했습니다!
    현재 POC(Proof of Concept) 단계로, 초기 도입 기업들을 대상으로 서비스의 효율성과 가치를 입증하고 있습니다.`,
    icon: Bell
  },
  { 
    id: 2, 
    title: "9월 시스템 점검 안내", 
    date: "2024. 09. 10",
    content: `9월 15일 새벽 2시부터 4시까지 시스템 점검이 예정되어 있습니다. 
    해당 시간 동안 서비스 이용이 제한될 수 있습니다.`,
    icon: Calendar
  },
];

const AnnouncementPage = () => {
  const [selectedId, setSelectedId] = useState(null);
  const router = useRouter();

  return (
    <div className="min-h-screen py-12 px-4 font-sans" style={{ backgroundColor: '#FFFFF2' }}>
      <div className="max-w-4xl mx-auto py-12 px-6 shadow-md rounded-lg" style={{ backgroundColor: '#DCDAF6', borderRadius: '50px 0 50px 0' }}>
        <div className="flex items-center mb-12"> 
          <ArrowLeft 
            className="h-8 w-8 text-indigo-700 cursor-pointer mr-2" 
            onClick={() => router.back()} 
          /> 
          <h1 className="text-4xl font-bold text-center">공지사항</h1>
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
                <div className={`rounded-full p-3 ${selectedId === announcement.id ? 'bg-indigo-600' : 'bg-white'} shadow-lg`}>
                  <announcement.icon className={`h-6 w-6 ${selectedId === announcement.id ? 'text-white' : 'text-indigo-600'}`} />
                </div>
                <div className="h-full w-0.5 bg-indigo-500 mt-3"></div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 flex-grow cursor-pointer hover:shadow-lg transition-shadow duration-200"
                   onClick={() => setSelectedId(selectedId === announcement.id ? null : announcement.id)}>
                <h2 className="text-xl font-semibold mb-2">{announcement.title}</h2>
                <p className="text-sm text-gray-600 mb-4">{announcement.date}</p>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: selectedId === announcement.id ? 'auto' : 0,
                    opacity: selectedId === announcement.id ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="whitespace-pre-line">{announcement.content}</p>
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