import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, MessageCircle, CreditCard, Settings, HelpCircle, ArrowLeft } from 'lucide-react';

export const faqs = [
  { id: 1, category: '계정', question: 'AI 챗봇 서비스를 어떻게 시작하나요?', answer: 'AI 챗봇 서비스는 회원가입 후 대시보드에서 간단한 설정으로 시작할 수 있습니다.' },
  { id: 2, category: '계정', question: '계정 설정을 변경하고 싶어요.', answer: '프로필 아이콘을 클릭하여 계정 설정을 변경할 수 있습니다.' },
  { id: 3, category: '서비스', question: '데이터 백업은 어떻게 하나요?', answer: '백업 및 복원 메뉴에서 수동 또는 자동으로 가능합니다.' },
];

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('모든 질문');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const router = useRouter();

  const categories = [
    { name: '모든 질문', icon: HelpCircle },
    { name: '계정', icon: MessageCircle },
    { name: '결제', icon: CreditCard },
    { name: '서비스', icon: Settings },
  ];

  const filteredFaqs = faqs.filter(faq =>
    (activeCategory === '모든 질문' || faq.category === activeCategory) &&
    (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#FFFFF2' }}>
      <div className="max-w-4xl mx-auto py-12 px-6 shadow-md rounded-lg" style={{ backgroundColor: '#DCDAF6', borderRadius: '50px 0 50px 0' }}>
        <div className="flex items-center mb-12">
          <ArrowLeft 
            className="h-8 w-8 text-indigo-700 cursor-pointer mr-2" 
            onClick={() => router.back()} 
          />
          <h1 className="text-4xl font-bold text-center">자주 묻는 질문</h1>
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

        {/* 카테고리 선택 */}
        <div className="flex justify-center space-x-4 mb-8">
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
              <category.icon className="mr-2 h-5 w-5" />
              {category.name}
            </motion.button>
          ))}
        </div>

        {/* FAQ 리스트 */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                className="w-full text-left px-6 py-4 flex justify-between items-center"
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              >
                {expandedId === faq.id ? (
                  <div className="font-bold text-lg text-indigo-500">{faq.question}</div>
                ) : (
                  <div className="font-semibold text-lg">{faq.question}</div>
                )}
                {expandedId === faq.id ? (
                  <ChevronUp className="h-5 w-5 text-indigo-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-indigo-500" />
                )}
              </button>
              {expandedId === faq.id && (
                <div className="px-6 py-4">
                  <p className="text-gray-600">{faq.answer}</p>
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
