import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../components/header';
import Modal from '../components/modal';
import ChangeInfo from './changeInfo';
import EditData from './editData';
import ModalErrorMSG from '../components/modalErrorMSG';
import config from '../../config';

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
      // 토큰이 있을 경우에만 접근 가능
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // 백엔드에서 사용자의 매장 정보를 가져옴
      const response = await fetch(`${config.apiDomain}/api/user-stores/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) { // 인증 실패 시 처리
        setErrorMessage('세션이 만료되었거나 인증에 실패했습니다. 다시 로그인해 주세요.');
        setShowErrorMessageModal(true);
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!response.ok) { // 기타 요청 실패 시 에러 처리
        throw new Error(`Failed to fetch store information: ${response.statusText}`);
      }

      const storeData = await response.json();

      // 매장에 대한 데이터가 1개 이상이면 매장 이름과 store id를 가져옴
      if (storeData && storeData.length > 0) {
        setStoreName(storeData[0].store_name); // 첫 번째 스토어 이름 설정
        setStoreId(storeData[0].store_id); // 첫 번째 스토어 ID 설정
      } else {
        setStoreName('');
      }
    } catch (error) {
      console.error('Error:', error); // 오류 로그 출력
      setErrorMessage('로딩 중에 에러가 발생 했습니다.');
      setShowErrorMessageModal(true); // 에러 모달 표시
    }
  };

  useEffect(() => {
    // 컴포넌트가 마운트되었음을 나타내는 플래그를 설정
    setIsMounted(true);

    // 디바이스가 모바일인지 여부를 확인하는 함수
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // 화면 너비가 768 이하일 때 모바일로 간주
    };

    handleResize(); // 초기화 시 한 번 호출
    window.addEventListener('resize', handleResize); // 윈도우 크기 조정 이벤트 리스너 추가

    fetchStoreInfo(); // 스토어 정보를 가져오는 함수 호출

    return () => window.removeEventListener('resize', handleResize); // 컴포넌트 언마운트 시 이벤트 리스너 제거
  }, []);

  if (!isMounted) {
    return null; // 마운트되기 전에는 아무것도 렌더링하지 않음
  }

  return (
    <div className="min-h-screen bg-gray-100 relative w-full flex flex-col">
      {/* Header 컴포넌트, 로그인 상태와 에러 메시지 모달 처리 */}
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        errorMessage={errorMessage}
        showErrorMessageModal={showErrorMessageModal}
        handleErrorMessageModalClose={() => setShowErrorMessageModal(false)}
      />

      <div id='main' className="flex-grow p-4">
        <main id="main-content" className="flex flex-col items-center text-center">
          <h1 className="text-xl font-bold mb-4">
            사람이 답할 시간은 끝났습니다.
            <br />
            이제는 로봇이 응답합니다
          </h1>

          <div className="p-2 rounded-lg flex items-center justify-center" style={{ minWidth: '30%', maxWidth: '360px' }}>
            <img src="banner_2.png" alt="상단 배너 이미지" className="w-full object-cover rounded-lg" />
          </div>

          <div className="mb-6 mt-8">
            <h2 className="text-xl font-bold">{storeName}님을</h2>
            <p className="text-lg">위한 서비스를 준비했어요.</p>
          </div>

          <div className='flex justify-center items-stretch' style={{ minWidth: '30%', maxWidth: '360px' }}>
            <div className="flex flex-col w-full items-stretch p-2" style={{ minWidth: '360px' }}>
              {/* 업종 정보 변경 모달 열기 */}
              <button
                onClick={() => setIsChangeInfoModalOpen(true)}
                className="flex flex-row max-w-xl justify-center items-center mx-auto font-sans rounded-lg py-2 w-full max-h-28 text-center mb-4 flex items-center"
                style={{ backgroundColor: "#9EB3FA" }}
              >
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-col w-full ml-4">
                    <p className='font-semibold text-lg mb-1.5 whitespace-nowrap'>업종 정보 변경</p>
                    <p className='text-sm whitespace-nowrap' style={{ color: '#5F5F5F' }}>사업장 정보를 수정해야 할 때</p>
                  </div>
                  <div className="flex justify-end w-max">
                    <img src='/change.png' className='max-w-20 max-h-20' alt="업종 정보 수정 이미지" />
                  </div>
                </div>
              </button>

              {/* 챗봇 미리보기 링크 */}
              <Link href={`/storeIntroductionOwner?id=${storeId}`} passHref>
                <div className="flex flex-row max-w-xl justify-center items-center mx-auto font-sans rounded-lg py-2 w-full max-h-28 text-center mb-4 flex items-center" style={{ backgroundColor: "#9EB3FA" }}>
                  <div className="flex flex-row justify-center items-center">
                    <div className="flex flex-col w-full ml-4">
                      <p className='font-semibold text-lg mb-1.5 whitespace-nowrap'>챗봇 미리보기</p>
                      <p className='text-sm whitespace-nowrap' style={{ color: '#5F5F5F' }}>손님에게 보여지는 화면을 보고 싶을 때</p>
                    </div>
                  </div>
                  <div className="flex justify-end w-max">
                    <img src='/preview.png' className='max-w-20 max-h-20' alt="챗봇 미리보기 이미지" />
                  </div>
                </div>
              </Link>

              {/* 데이터 수정하기 모달 열기 */}
              <button
                onClick={() => setIsEditDataModalOpen(true)}
                className="flex flex-row max-w-xl justify-center items-center mx-auto font-sans rounded-lg py-2 w-full max-h-28 text-center mb-4 flex items-center"
                style={{ backgroundColor: "#9EB3FA" }}
              >
                <div className="flex flex-row justify-center items-center">
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col w-full ml-4">
                      <p className='font-semibold text-lg mb-1.5 whitespace-nowrap'>데이터 수정하기</p>
                      <p className='text-sm whitespace-nowrap' style={{ color: '#5F5F5F' }}>챗봇 데이터 수정을 원할 때</p>
                    </div>
                    <div className="flex justify-end w-max">
                      <img src='/modify.png' className='max-w-20 max-h-20' alt="FAQ 데이터 수정하기 이미지" />
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* 모바일일 경우에 footer 출력 */}
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

      {/* ChangeInfo 모달 */}
      {isChangeInfoModalOpen && (
        <Modal onClose={() => setIsChangeInfoModalOpen(false)}>
          <ChangeInfo />
        </Modal>
      )}

      {/* EditData 모달 */}
      {isEditDataModalOpen && (
        <Modal onClose={() => setIsEditDataModalOpen(false)}>
          <EditData />
        </Modal>
      )}

      {/* 에러 메시지 모달 */}
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
