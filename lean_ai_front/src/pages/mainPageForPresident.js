import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/header';
import Modal from '../components/modal';
import ChangeInfo from './changeInfo';
import EditData from './editData';
import ModalErrorMSG from '../components/modalErrorMSG';
import config from '../../config';
import styles from '../styles/button.module.css'; 

const MainPageWithMenu = () => {
  const [isChangeInfoModalOpen, setIsChangeInfoModalOpen] = useState(false); // '업종 정보 변경' 모달 상태
  const [isEditDataModalOpen, setIsEditDataModalOpen] = useState(false); // '데이터 수정하기' 모달 상태
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 상태 관리
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 저장
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 표시 상태
  const [storeName, setStoreName] = useState(''); // 스토어 이름 저장
  const [storeId, setStoreId] = useState(''); // 스토어 ID 저장
  const [isMobile, setIsMobile] = useState(false); // 모바일 환경 여부
  const [isMounted, setIsMounted] = useState(false); // 컴포넌트가 마운트되었는지 확인하는 플래그

  const router = useRouter();

  // 스토어 정보를 가져오는 함수
  const fetchStoreInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${config.apiDomain}/api/user-stores/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setErrorMessage('세션이 만료되었거나 인증에 실패했습니다. 다시 로그인해 주세요.');
        setShowErrorMessageModal(true);
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch store information: ${response.statusText}`);
      }

      const storeData = await response.json();

      if (storeData && storeData.length > 0) {
        setStoreName(storeData[0].store_name);
        setStoreId(storeData[0].store_id);
      } else {
        setStoreName('');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('로딩 중에 에러가 발생 했습니다.');
      setShowErrorMessageModal(true);
    }
  };

  useEffect(() => {
    setIsMounted(true);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    fetchStoreInfo();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMounted) {
    return null;
  }

  const goToChatbot = () => {
    if (storeId) {
      router.push(`/storeIntroductionOwner?id=${storeId}`);
    }
  };

  return (
    <div id='main' className="flex-grow bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 min-h-screen">
      <div className="relative w-full flex flex-col">
        <Header
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          errorMessage={errorMessage}
          showErrorMessageModal={showErrorMessageModal}
          handleErrorMessageModalClose={() => setShowErrorMessageModal(false)}
        />
        <main id="main-content" className="flex flex-col items-center text-center pt-20">
          <h1 className="text-2xl font-bold mb-4">
            사람이 답할 시간은 끝났습니다.
            <br />
            이제는 로봇이 응답합니다
          </h1>

          <div className="p-2 rounded-lg flex items-center justify-center" style={{ minWidth: '30%', maxWidth: '360px' }}>
            <img src="banner_2.png" alt="상단 배너 이미지" className="w-full object-cover rounded-lg" />
          </div>

          <div className="mb-6 mt-8">
            <p className="text-xlg"> <span className='font-bold text-2xl'>{storeName}</span>님을 <br />위한 서비스를 준비했어요.</p>
          </div>

          <div id='button' className="flex justify-center items-stretch" style={{ minWidth: '30%', maxWidth: '360px' }}>
            <div className="flex flex-col w-full items-stretch p-2">
              {/* 업종 정보 변경 모달 열기 */}
              <button
                onClick={() => setIsChangeInfoModalOpen(true)}
                className={styles.button}
              >
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-col w-full ml-4">
                    <p className={styles['text-lg']}>업종 정보 변경</p>
                    <p className={styles['text-sm']}>사업장 정보를 수정해야 할 때</p>
                  </div>
                  <div className="flex justify-end w-max">
                    <img src='/change.png' className={styles.icon} alt="업종 정보 수정 이미지" />
                  </div>
                </div>
              </button>

              {/* 챗봇 미리보기 링크 */}
              <button
                onClick={goToChatbot}
                className={styles.button}
              >
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-col w-full ml-4">
                    <p className={styles['text-lg']}>챗봇 미리보기</p>
                    <p className={styles['text-sm']}>손님에게 보여지는 화면을 보고 싶을 때</p>
                  </div>
                  <div className="flex justify-end w-max">
                    <img src='/preview.png' className={styles.icon} alt="챗봇 미리보기 이미지" />
                  </div>
                </div>
              </button>

              {/* 데이터 수정하기 모달 열기 */}
              <button
                onClick={() => setIsEditDataModalOpen(true)}
                className={styles.button}
              >
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-col w-full ml-4">
                    <p className={styles['text-lg']}>데이터 수정하기</p>
                    <p className={styles['text-sm']}>챗봇 데이터 수정을 원할 때</p>
                  </div>
                  <div className="flex justify-end w-max">
                    <img src='/modify.png' className={styles.icon} alt="FAQ 데이터 수정하기 이미지" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </main>
      </div>

      {!isMobile && (
        <footer className='bg-black text-gray-400 text-xs font-sans p-4 w-full flex justify-start items-center mt-8'>
          <img src='Lean-AI logo.png' className='h-12 mr-4' />
          <p className='whitespace-pre-line'>
            {`(주)린에이아이
            (우)08789 서울 관악구 봉천로 545 201호
            © LEAN AI All Rights Reserved.`}
          </p>
        </footer>
      )}

      {isChangeInfoModalOpen && (
        <Modal onClose={() => setIsChangeInfoModalOpen(false)}>
          <ChangeInfo />
        </Modal>
      )}

      {isEditDataModalOpen && (
        <Modal onClose={() => setIsEditDataModalOpen(false)}>
          <EditData />
        </Modal>
      )}

      <ModalErrorMSG show={showErrorMessageModal} onClose={() => setShowErrorMessageModal(false)}>
        <p style={{ whiteSpace: 'pre-line' }}>
          {typeof errorMessage === 'object' ? (
            Object.entries(errorMessage).map(([key, value]) => (
              <span key={key}>
                {key}: {Array.isArray(value) ? value.join(', ') : value.toString()}<br />
              </span>
            ))
          ) : (
            errorMessage
          )}
        </p>
      </ModalErrorMSG>

      <style jsx>{`
        @media (max-width: 768px) {
          footer {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default MainPageWithMenu;
