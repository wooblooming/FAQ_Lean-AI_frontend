import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { notifications } from '/public/text/notification.js'// 공지사항 데이터


const AnnouncementPage = () => {
  const [selectedId, setSelectedId] = useState(null); // 선택된 공지사항 ID를 저장하는 상태
  const router = useRouter(); // 페이지 이동 및 뒤로 가기 기능을 위한 라우터

  return (
    <div className="min-h-screen py-12 px-4 font-sans bg-violet-50" >
      <div className="max-w-4xl mx-auto py-12 px-6 shadow-md rounded-lg bg-white" style={{ borderRadius: '50px 0 50px 0' }}>
        <div className="flex items-center mb-12">
          <ChevronLeft
            className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
            onClick={() => router.back()} // 뒤로가기 버튼
          />
          <h1 className="text-3xl font-bold text-center text-indigo-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>공지사항</h1>
        </div>

        <div className="relative">
          {/* 공지사항 목록 렌더링 */}
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id} // 각 공지사항의 고유 ID
              className="mb-8 flex"
              initial={{ opacity: 0, y: 50 }} // 초기 애니메이션 상태
              animate={{ opacity: 1, y: 0 }} // 애니메이션 완료 상태
              transition={{ duration: 0.5, delay: index * 0.1 }} // 순차 애니메이션 적용
            >
              {/* 아이콘 영역 */}
              <div className="flex flex-col items-center mr-4">
                <div className={`rounded-full p-3 ${selectedId === notification.id ? 'bg-indigo-600' : 'bg-white'} shadow-lg`}>
                  <notification.icon className={`h-6 w-6 ${selectedId === notification.id ? 'text-white' : 'text-indigo-600'}`} />
                </div>
                <div className="h-full w-0.5 bg-indigo-500 mt-3"></div>
              </div>

              {/* 공지사항 제목 및 내용 영역 */}
              <div className="bg-indigo-100 rounded-lg shadow-md p-6 flex-grow cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => setSelectedId(selectedId === notification.id ? null : notification.id)}>
                <h2 className="text-xl font-semibold mb-2">{notification.title}</h2>
                <p className="text-sm text-gray-600 mb-4">{notification.date}</p>

                {/* 공지사항 세부 내용 */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }} // 세부 내용 초기 애니메이션 상태
                  animate={{
                    height: selectedId === notification.id ? 'auto' : 0,
                    opacity: selectedId === notification.id ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="whitespace-pre-line">{notification.content}</p>
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
