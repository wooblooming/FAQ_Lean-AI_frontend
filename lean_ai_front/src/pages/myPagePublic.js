import React from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, X } from 'lucide-react';
import useMyPage from '../hooks/useMyPage';
import { fetchPublicUser } from '../fetch/fetchPublicUser';
import { useAuth } from '../contexts/authContext';
import { useStore } from '../contexts/storeContext';
import { usePublic } from '../contexts/publicContext';
import UserProfileForm from '../components/component/userProfile';
import QrCodeSection from '../components/component/qrCode';
import EventSwitch from '../components/component/event';
import SnsConnect from '../components/component/snsConnect';
import EventAlertModal from '../components/modal/eventModal';
import ModalMSG from '../components/modal/modalMSG';
import ModalErrorMSG from '../components/modal/modalErrorMSG';
import ConfirmDeleteAccountModal from '../components/modal/confirmDeleteAccountModal';
import config from '../../config';

const MyPagePublic = () => {
  const { token, removeToken } = useAuth();
  const { storeID, removeStoreID } = useStore();
  const { isPublicOn } = usePublic();
  const router = useRouter(); 

  const {
    userData, handleUserDataChange, profileImage,
    toggleImageModal, chooseImage, applyDefaultImage, isImageModalOpen,    
    showQrCode, qrUrl, setQrUrl, handleGenerateQrCode, handleDownloadQrCode, toggleQrCode,
    isEventOn, toggleEventOn, showEventAlertModal, handleEventAlertModalClose,
    handleConfirmAccountDeletion, handleAccountDeletionClick, setShowDeleteModal, showDeleteModal,
    handleSaveChanges, isChanged,
    showMessageModal, message, handleMessageModalClose,
    showErrorMessageModal, errorMessage, handleErrorMessageModalClose
  } = useMyPage({
    token, removeToken,
    storeID, removeStoreID,
    fetchUserData: fetchPublicUser,
    updateProfileUrl: `${config.apiDomain}/public/user-profile/`,
    updateProfilePhotoUrl: `${config.apiDomain}/public/update-profile-photo/`,
    generateQrCodeUrl: `${config.apiDomain}/public/generate-qr-code/`,
    deactivateAccountUrl: `${config.apiDomain}/public/deactivate-account/`,
  });

  return (
    <div className="bg-violet-50 flex flex-col items-center justify-center relative font-sans min-h-screen">
      <div className="bg-white p-8 my-4 rounded-lg shadow-lg max-w-sm w-full text-center relative">
        <div className='flex justify-between items-center'>
          <ChevronLeft
            className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
            onClick={() => router.back()} // 뒤로가기 버튼
          />
          <p className='font-semibold mt-2.5'> </p>
          <button
            className={`font-semibold text-lg ${isChanged ? 'text-indigo-500' : 'text-gray-500'}`}
            onClick={handleSaveChanges}
            disabled={!isChanged}
          >
            <p style={{ fontFamily: "NanumSquareExtraBold" }}>완료</p>
          </button>
        </div>

        {/* 프로필 이미지 섹션 */}
        <div className="mb-4 relative">
          <img
            src={profileImage}
            alt="프로필 이미지"
            className="w-24 h-24 rounded-full mx-auto mb-4 border border-2 border-indigo-500"
            onClick={toggleImageModal}
            style={{ cursor: 'pointer' }}
          />
          <div
            className="absolute flex items-center justify-center text-xs font-bold text-white"
            style={{
              bottom: '0',
              left: '50%',
              transform: 'translate(-50%, 50%)',
              backgroundColor: '#6366f1',
              padding: '4px 8px',
              borderRadius: '12px',
              width: '60px',
              cursor: 'pointer',
            }}
            onClick={toggleImageModal}
          >
            EDIT
          </div>
        </div>

        {/* 사용자 정보 입력 필드 */}
        {userData && (
            <UserProfileForm
              isPublicOn={isPublicOn}
              token={token}
              storeID={storeID}
              userData={userData} // 유효한 userData만 전달
              onUpdateUserData={handleUserDataChange}
            />
          )
        }


        {/* QR 코드 섹션 */}
        <QrCodeSection
          userData={userData}
          qrUrl={qrUrl}
          setQrUrl={setQrUrl}
          showQrCode={showQrCode}
          toggleQrCode={toggleQrCode}
          handleDownloadQrCode={handleDownloadQrCode}
          handleGenerateQrCode={handleGenerateQrCode}
        />

        {/* 이벤트 스위치 */}
        <EventSwitch
          isEventOn={isEventOn}
          toggleEventOn={toggleEventOn}
        />

        {/* 회원 탈퇴 버튼 */}
        <button
          className="text-red-600 font-bold mt-4 hover:underline"
          onClick={handleAccountDeletionClick}  // 탈퇴 모달 열기
        >
          회원탈퇴
        </button>

        {/* 추후 업데이트 */}
        {/* SNS 연결 섹션 
        <SnsConnect
          snsList={snsList}
          toggleSnsConnection={toggleSnsConnection}
        />
        */}

        {/* 이미지 모달 */}
        {isImageModalOpen && (
          <div id="imageModal" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="modal-content bg-white p-6 rounded-lg text-center" style={{ width: '380px', position: 'relative' }}>
              <button
                onClick={toggleImageModal}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <X className="bg-indigo-500 rounded-full text-white p-1" />
              </button>
              <h2 className="text-2xl font-bold mb-4">프로필 사진 설정</h2>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="fileInput"
                onChange={chooseImage}
              />
              <button
                onClick={() => document.getElementById('fileInput').click()}
                className="block w-full mb-2 py-2 text-black"
              >
                앨범에서 사진/동영상 선택
              </button>
              <button onClick={applyDefaultImage} className="block w-full py-2 text-black">
                기본 이미지 적용
              </button>
            </div>
          </div>
        )}

        {/* 이벤트 모달 */}
        <EventAlertModal
          show={showEventAlertModal}
          onClose={handleEventAlertModalClose}
        />

        {/* 계정 삭제 모달 */}
        <ConfirmDeleteAccountModal
          show={showDeleteModal}
          onClose={(confirmed) => {
            setShowDeleteModal(false);
            if (confirmed) {
              handleConfirmAccountDeletion(); // 탈퇴 확정 시 처리
            }
          }}
          message="정말 탈퇴를 하시겠습니까?"  // 탈퇴 확인 메시지
        />

        {/* 성공 메시지 모달 */}
        <ModalMSG
          show={showMessageModal}
          onClose={handleMessageModalClose}
          title="Success"
        >
          <p style={{ whiteSpace: 'pre-line' }}>
            {message}
          </p>
        </ModalMSG>

        {/* 에러 메시지 모달 */}
        <ModalErrorMSG
          show={showErrorMessageModal}
          onClose={handleErrorMessageModalClose}
          title="Error"
        >
          <p style={{ whiteSpace: 'pre-line' }}>
            {errorMessage}
          </p>
        </ModalErrorMSG>


      </div>
    </div>
  );
};

export default MyPagePublic;