import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, MessageSquare, TrendingUp, CreditCard, Zap, Shield, Rocket, Award, Users, Building } from 'lucide-react';
import { useRouter } from 'next/router';
import Nav from '../components/navBar';
import Footer from '../components/footer';
import QRChatAnimation from '../components/chatbot_index';

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

   // 페이지 렌더링 시 sessionStorage에서 토큰 확인하여 로그인 상태 설정
   useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleClick = () => {
    if (isLoggedIn) {
      router.push('/mainPageForPresident');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col">
      <Nav />

      <main className="flex-grow pt-24 pb-12 px-6">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
          <motion.div
            className="w-1/2 text-left mb-12 lg:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-800">
              무엇이든 물어보세요
            </h2>
            <h3 className="text-3xl lg:text-4xl font-bold mb-4 text-blue-600">
              QR코드로
            </h3>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-800">
              무엇이든 답해드려요
            </h2>
            <h3 className="text-3xl lg:text-4xl font-bold mb-8 text-blue-600">
              AI챗봇으로
            </h3>
            <motion.button
              className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClick}
            >
              {isLoggedIn ? "메인 페이지로 이동" : "지금 시작하기"} <ChevronRight className="inline ml-2" />
            </motion.button>
          </motion.div>
          <motion.div
            className="lg:w-1/2 flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-80 h-120">
              <QRChatAnimation />
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}