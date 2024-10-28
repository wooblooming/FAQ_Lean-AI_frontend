import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, ChevronLeft, CreditCard, Settings, HelpCircle, UserRound } from 'lucide-react';

// FAQ 데이터
export const faqs = [
  { id: 1, category: '계정', question: 'AI 챗봇 서비스를 어떻게 시작하나요?', answer: 'AI 챗봇 서비스는 회원가입 후 대시보드에서 간단한 설정으로 시작할 수 있습니다.' },
  { id: 2, category: '계정', question: '계정 설정을 변경하고 싶어요.', answer: '프로필 아이콘을 클릭하여 계정 설정을 변경할 수 있습니다.' },
  { id: 3, category: '서비스', question: '데이터 백업은 어떻게 하나요?', answer: '백업 및 복원 메뉴에서 수동 또는 자동으로 가능합니다.' },
];

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('모든 질문'); // 선택된 카테고리를 저장
  const [searchTerm, setSearchTerm] = useState(''); // 검색어를 저장
  const [expandedId, setExpandedId] = useState(null); // 펼쳐진 질문의 ID를 저장
  const router = useRouter();

  // 카테고리 버튼 데이터
  const categories = [
    { name: '모든 질문', icon: HelpCircle },
    { name: '계정', icon: UserRound },
    { name: '결제', icon: CreditCard },
    { name: '서비스', icon: Settings },
  ];

  // 카테고리 및 검색어를 기준으로 FAQ를 필터링
  const filteredFaqs = faqs.filter(faq =>
    (activeCategory === '모든 질문' || faq.category === activeCategory) &&
    (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen py-12 px-4 font-sans bg-violet-50">
      <div className="max-w-4xl mx-auto py-12 px-6 shadow-md rounded-lg" style={{ backgroundColor: '#fff', borderRadius: '50px 0 50px 0' }}>
        <div className="flex items-center mb-12">
          <ChevronLeft
            className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
            onClick={() => router.back()}
          />
          <h1 className="text-3xl font-bold text-center text-indigo-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>자주 묻는 질문</h1>
        </div>

        {/* 검색 바 */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="질문 검색하기"
            className="w-full py-3 pl-12 pr-4 text-gray-900 border-2 border-indigo-500 rounded-full transition-all duration-300"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-3.5 h-6 w-6 text-indigo-400" />
        </div>

        {/* 카테고리 버튼 */}
        <div className="grid grid-cols-2 md:grid-cols-4 justify-center space-x-4 mb-8">
          {categories.map((category) => (
            <motion.button
              key={category.name}
              className={`flex items-center px-4 py-2 rounded-full ${
                activeCategory === category.name ? 'bg-indigo-500 text-white' : 'bg-white text-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.name)}
            >
              <category.icon className='mr-2 md:h-5 md:w-5' />
              <p className='whitespace-nowrap'> {category.name} </p>
            </motion.button>
          ))}
        </div>

        {/* FAQ 리스트 */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="bg-indigo-100 rounded-lg overflow-hidden">
              {/* 질문 부분 */}
              <button
                className="w-full text-left px-6 py-4 flex justify-between items-center"
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              >
                <div className={`font-semibold text-xl ${expandedId === faq.id ? 'text-indigo-500' : ''}`}>{faq.question}</div>
                {expandedId === faq.id ? (
                  <ChevronUp className="h-5 w-5 text-indigo-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-indigo-500" />
                )}
              </button>

              {/* 답변 부분 */}
              {expandedId === faq.id && (
                <div className="px-6 py-4 bg-white">
                  <p className="text-gray-600 text-lg">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
