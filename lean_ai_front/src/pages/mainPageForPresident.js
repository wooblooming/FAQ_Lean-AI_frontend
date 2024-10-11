import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/header';
import Modal from '../components/modal';
import ChangeInfo from './changeInfo';
import EditData from './editData';
import ModalErrorMSG from '../components/modalErrorMSG';
import config from '../../config';
import styles from '../styles/button.module.css';
import Footer from '../components/footer';

const MainPageWithMenu = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isChangeInfoModalOpen, setIsChangeInfoModalOpen] = useState(false);
  const [isEditDataModalOpen, setIsEditDataModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [slug, setStoreSlug] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const buttonRefs = useRef([]);
  const router = useRouter();
  const maxButtonHeight = Math.max(...buttonRefs.current.map(button => button?.offsetHeight || 0));

  const handleResize = () => {
    const isMobileDevice = window.innerWidth <= 768;
    setIsMobile(isMobileDevice);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    fetchStoreInfo();
  }, []);

  const fetchStoreInfo = async () => {
    try {
      const token = sessionStorage.getItem('token');
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
        sessionStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch store information: ${response.statusText}`);
      }

      const storeData = await response.json();
      if (storeData && storeData.length > 0) {
        setStoreName(storeData[0].store_name);
        setStoreSlug(storeData[0].slug);
      } else {
        setStoreName('');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('로딩 중에 에러가 발생 했습니다.');
      setShowErrorMessageModal(true);
    }
  };

  if (!isMounted) {
    return null;
  }

  const goToChatbot = () => {
    if (slug) {
      const encodedSlug = encodeURIComponent(slug);
      router.push(`/storeIntroductionOwner/${encodedSlug}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-violet-50">
      {/* Header 및 메인 콘텐츠를 감싸는 컨테이너 */}
      <div className="flex-grow">
        <Header
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          errorMessage={errorMessage}
          showErrorMessageModal={showErrorMessageModal}
          handleErrorMessageModalClose={() => setShowErrorMessageModal(false)}
        />
        <main id="main-content" className="flex flex-col md:mx-auto md:px-0 py-4 mt-20">
          {/* 버튼 영역 */}
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} justify-center md:space-x-4 space-y-2 md:space-y-0 w-full p-2`}>
            {/* '매장 정보 변경' 버튼 */}
            <button
              ref={(el) => (buttonRefs.current[0] = el)}
              style={{ height: isMobile ? 'auto' : `${maxButtonHeight}px`, minHeight: `${maxButtonHeight}px`, minWidth: isMobile ? '100%' : 'auto' }}
              onClick={() => setIsChangeInfoModalOpen(true)}
              className={`${styles.button} text-center md:text-left`}
            >
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col w-full space-x-4">
                  <p className={styles['text-lg']} style={{ fontSize: isMobile ? '20px' : '25px' }}>매장 정보 변경</p>
                  <p className={styles['text-sm']} style={{ fontSize: isMobile ? '15px' : '18px' }}>사업장 정보를 수정하여 최신 상태로 유지하세요</p>
                </div>
                <div className="flex justify-end w-max">
                  <img src='/change.png' className={`${styles.icon} md:w-20 md:h-20`} alt="매장 정보 수정 이미지" />
                </div>
              </div>
            </button>

            {/* '챗봇 미리보기' 버튼 */}
            <button
              ref={(el) => (buttonRefs.current[1] = el)}
              style={{ height: isMobile ? 'auto' : `${maxButtonHeight}px`, minHeight: `${maxButtonHeight}px`, minWidth: isMobile ? '100%' : 'auto' }}
              onClick={goToChatbot}
              className={`${styles.button} text-center md:text-left`}
            >
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col w-full space-x-4">
                  <p className={styles['text-lg']} style={{ fontSize: isMobile ? '20px' : '25px' }}>챗봇 미리보기</p>
                  <p className={styles['text-sm']} style={{ fontSize: isMobile ? '15px' : '18px' }}>손님에게 보여지는 화면을 확인해 보세요</p>
                </div>
                <div className="flex justify-end w-max">
                  <img src='/preview.png' className={`${styles.icon} md:w-20 md:h-20`} alt="챗봇 미리보기 이미지" />
                </div>
              </div>
            </button>

            {/* '데이터 수정' 버튼 */}
            <button
              ref={(el) => (buttonRefs.current[2] = el)}
              style={{ height: isMobile ? 'auto' : `${maxButtonHeight}px`, minHeight: `${maxButtonHeight}px`, minWidth: isMobile ? '100%' : 'auto' }}
              onClick={() => setIsEditDataModalOpen(true)}
              className={`${styles.button} text-center md:text-left`}
            >
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col w-full space-x-4">
                  <p className={styles['text-lg']} style={{ fontSize: isMobile ? '20px' : '25px' }}>데이터 수정</p>
                  <p className={styles['text-sm']} style={{ fontSize: isMobile ? '15px' : '18px' }}>챗봇 데이터를 수정해 보세요</p>
                </div>
                <div className="flex justify-end w-max">
                  <img src='/modify.png' className={`${styles.icon} md:w-20 md:h-20`} alt="FAQ 데이터 수정하기 이미지" />
                </div>
              </div>
            </button>
          </div>

        </main>
      </div>

      {/* Footer 섹션 - 항상 화면 아래에 위치 */}
      <Footer className="w-full mt-auto hidden md:block" isMobile={isMobile} />

      {isChangeInfoModalOpen && (
        <Modal onClose={() => setIsChangeInfoModalOpen(false)}>
          <ChangeInfo />
        </Modal>
      )}

      {isEditDataModalOpen && (
        <Modal
          onClose={() => { setIsEditDataModalOpen(false); }}
        >
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
    </div>
  );
};

export default MainPageWithMenu;
