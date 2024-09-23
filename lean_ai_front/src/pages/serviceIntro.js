import React, { useState, useEffect } from 'react';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import { Zap, Shield, Rocket, ArrowRight, MessageSquare, TrendingUp, PieChart, Users, DollarSign, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div 
    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
    whileHover={{ y: -5 }}
  >
    <Icon className="text-indigo-600 w-12 h-12 mb-4" />
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const StatCard = ({ icon: Icon, value, label }) => (
  <div className="bg-indigo-600 text-white p-6 rounded-xl text-center">
    <Icon className="w-12 h-12 mx-auto mb-4" />
    <div className="text-3xl font-bold mb-2">{value}</div>
    <div className="text-sm uppercase tracking-wide">{label}</div>
  </div>
);

const ServiceIntroPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { scrollYProgress } = useViewportScroll();
  const yPosAnim = useTransform(scrollYProgress, [0, 0.5], [0, 300]);

  const features = [
    { icon: Zap, title: "AI 기반 자동화", description: "최첨단 AI로 비즈니스 프로세스를 자동화하여 효율성을 극대화합니다." },
    { icon: Shield, title: "데이터 보안", description: "은행 수준의 암호화로 고객 데이터를 안전하게 보호합니다." },
    { icon: Rocket, title: "비즈니스 성장", description: "데이터 기반 인사이트로 비즈니스 성장을 가속화합니다." },
    { icon: MessageSquare, title: "고객 응대", description: "AI 챗봇으로 언제 어디서나 고객과 소통합니다." },
    { icon: TrendingUp, title: "매출 최적화", description: "AI 기반 개인화 전략으로 매출을 극대화합니다." },
    { icon: PieChart, title: "실시간 분석", description: "실시간 데이터 분석으로 신속한 의사결정을 지원합니다." },
  ];

  const stats = [
    { icon: Users, value: "10,000+", label: "만족한 고객" },
    { icon: DollarSign, value: "30%", label: "평균 매출 증가" },
    { icon: Clock, value: "5시간", label: "일일 시간 절약" },
  ];

  const testimonials = [
    { name: "OOO", role: "카페 사장", content: "무물 덕분에 고객 응대 시간이 70% 줄어들었어요. 이제 더 중요한 업무에 집중할 수 있게 되었죠." },
    { name: "OOO", role: "온라인 쇼핑몰 운영자", content: "맞춤형 프로모션 추천 기능이 정말 놀라워요. 작년 대비 매출이 50% 이상 증가했습니다." },
    { name: "OOO", role: "동네 빵집 운영", content: "AI 챗봇이 24시간 문의에 대응해주니 자는 시간에도 주문이 들어와요. 정말 혁신적이에요!" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-center text-center mb-8">
          <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mr-4">
            <ArrowLeft className="mr-2 text-4xl" />
          </Link>
          <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            MUMUL: AI로 비즈니스의 미래를 열다
          </h1>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-xl text-gray-600 mb-8">소상공인을 위한 올인원 AI 비즈니스 솔루션</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-indigo-700 transition duration-300"
          >
            14일 무료 체험 시작하기
          </motion.button>
        </motion.div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">무물이 제공하는 핵심 기능</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">무물의 실제 효과</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>

        <div className="mb-20 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">고객 성공 사례</h2>
          <div className="bg-white p-8 rounded-xl shadow-xl">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xl italic mb-4">"{testimonials[currentTestimonial].content}"</p>
              <p className="font-semibold">{testimonials[currentTestimonial].name}</p>
              <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
            </motion.div>
          </div>
        </div>

        <div className="text-center bg-indigo-600 text-white p-12 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-6">무물과 함께 비즈니스를 혁신하세요</h2>
          <p className="text-xl mb-8">AI의 힘으로 당신의 비즈니스를 한 단계 끌어올리세요.</p>
          <motion.a 
            href="mailto:ch@lean-ai.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-gray-100 transition duration-300"
          >
            지금 상담 받기
          </motion.a>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">무물 살펴보기</h2>
          <div className="aspect-w-16 aspect-h-9">
            <img src="/api/placeholder/1280/720" alt="무물 대시보드 데모" className="rounded-xl shadow-2xl" />
          </div>
          <p className="mt-4 text-gray-600">무물 대시보드 데모 영상</p>
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="mailto:ch@lean-ai.com"
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-indigo-700 transition duration-300"
          >
            문의하기
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceIntroPage;