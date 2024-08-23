import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const MainPageWithMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [storeName, setStoreName] = useState(''); // 스토어 이름을 저장할 상태 추가

  const router = useRouter();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // 스토어 정보를 가져오는 함수
  const fetchStoreInfo = async () => {
    try {
      const token = localStorage.getItem('token'); // 저장된 JWT 토큰을 가져옴
      console.log('Token:', token);
      if (!token) {
        router.push('/login'); // 토큰이 없으면 로그인 페이지로 리디렉션
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/user-stores/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 토큰을 헤더에 포함
        }
      });
      if (response.status === 401) {
        // 토큰 만료 또는 인증 실패
        
        
        
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch store information: ${response.statusText}`);
      }

      const storeData = await response.json();
      if (storeData && storeData.length > 0) {
        setStoreName(storeData[0].store_name); // 첫 번째 스토어의 이름을 설정
      } else {
        setStoreName('No Store Available'); // 스토어가 없을 경우 처리
      }
    } catch (error) {
      console.error('Error:', error);
      setStoreName('Error loading store data');
    }
  };

  // 컴포넌트가 마운트될 때 스토어 정보를 가져옴
  useEffect(() => {
    fetchStoreInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      <nav className="flex justify-between items-center mb-6">
        <div className="text-lg font-bold">LEAN AI</div>
        <div className="flex space-x-4">
          <Link href="/notification" className="text-xl flex items-center justify-center w-8 h-8">
            <i className="fas fa-bell"></i>
          </Link>
          <button 
            id="menuToggle" 
            className="text-xl flex items-center justify-center w-8 h-8 focus:outline-none" 
            onClick={toggleMenu} 
          >
            <span className={`menu-icon ${menuOpen ? 'open' : ''}`}>
              <div></div>
              <div></div>
              <div></div>
            </span>
          </button>
        </div>
      </nav>

      <main id="main-content" className="text-center">
        <h1 className="text-xl font-bold mb-4">
          사람이 답할 시간은 끝났습니다.
          <br />
          이제는 로봇이 응답합니다
        </h1>

        <div className="bg-gray-300 rounded-lg flex items-center justify-center mb-6 mx-auto" style={{ width: '100%', maxWidth: '500px' }}>
          <img src="banner_2.png" alt="상단 배너 이미지" className="w-full object-cover rounded-lg" />
        </div>

        <div className="mb-6 mt-8">
          <h2 className="text-xl font-bold">{storeName}님을</h2>
          <p className="text-lg">위한 서비스를 준비했어요.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <Link href="/changeInfo" className="bg-gray-300 rounded-lg py-8 w-full text-center">
            업종 정보 변경
          </Link>
          <Link href="/editData" className="bg-gray-300 rounded-lg py-8 w-full text-center">
            FAQ 데이터 수정하기
          </Link>
        </div>
      </main>

      {menuOpen && (
        <div
          id="fullscreenOverlay"
          className="fullscreen-overlay fixed inset-0 flex flex-col justify-center items-center text-center z-20"
        >
          <button
            className="absolute top-4 right-4 text-3xl text-white focus:outline-none no-blur"
            onClick={toggleMenu}
          >
            <span className={`menu-icon ${menuOpen ? 'open' : ''}`}>
              <div></div>
              <div></div>
              <div></div>
            </span>
          </button>
          <ul className="space-y-4 text-lg text-white text-center">
            <li><p className="mt-2 cursor-pointer text-white" onClick={handleLoginLogoutClick}>Log in / Log out</p></li>
            <li><Link href="/myPage">마이페이지</Link></li>
            <li><Link href="/notification">공지사항</Link></li>
            <li><Link href="/qna">자주 묻는 질문</Link></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MainPageWithMenu;
