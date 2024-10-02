import React, { useState, useEffect } from 'react';
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
  const [isChangeInfoModalOpen, setIsChangeInfoModalOpen] = useState(false); // '업종 정보 변경' 모달 상태
  const [isEditDataModalOpen, setIsEditDataModalOpen] = useState(false); // '데이터 수정하기' 모달 상태
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 상태 관리
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 저장
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 표시 상태
  const [storeName, setStoreName] = useState(''); // 스토어 이름 저장
  const [slug, setStoreSlug] = useState(''); // 스토어 slug 저장
  const [isMounted, setIsMounted] = useState(false); // 컴포넌트가 마운트되었는지 확인하는 플래그

  const router = useRouter();

  // 스토어 정보를 가져오는 함수
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
      // console.log("data : ", storeData);

      if (storeData && storeData.length > 0) {
        setStoreName(storeData[0].store_name);
        setStoreSlug(storeData[0].slug);
        //console.log(slug);
        // const encodedSlug = encodeURIComponent(slug);  // 슬러그 인코딩
        //console.log(encodedSlug);
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

    fetchStoreInfo();

    return ;
  }, []);

  if (!isMounted) {
    return null;
  }

  const goToChatbot = () => {
    if (slug) {
      const encodedSlug = encodeURIComponent(slug);  // 슬러그 인코딩
      //console.log('Navigating to:', `/storeIntroductionOwner/${encodedSlug}`); // URL 로그 확인
      router.push(`/storeIntroductionOwner/${encodedSlug}`);
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
          <div id='button' className="flex justify-center items-stretch" style={{ minWidth: '30%', maxWidth: '360px' }}>
            <div className="flex flex-col w-full items-stretch p-2">
              {/* 업종 정보 변경 모달 열기 */}
              <button
                onClick={() => setIsChangeInfoModalOpen(true)}
                className={styles.button}
              >
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-col w-full ml-4">
                    <p className={styles['text-lg']}>매장 정보 변경</p>
                    <p className={styles['text-sm']}>사업장 정보를 수정해야 할 때</p>
                  </div>
                  <div className="flex justify-end w-max">
                    <img src='/change.png' className={styles.icon} alt="매장 정보 수정 이미지" />
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
                    <p className={styles['text-lg']}>데이터 수정</p>
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
      
      {/* 푸터 섹션 */}
      <Footer />
      
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
    </div>
  );
};

export default MainPageWithMenu;
