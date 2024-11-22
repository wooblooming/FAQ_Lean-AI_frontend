import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/authContext';
import { useStore } from '../contexts/storeContext';
import { X } from 'lucide-react';
import { fetchPublicDepartment } from '../fetch/fetchPublicDepart';
import ComplaintDetailTabs from './complaintDetailTabs';
import ComplaintDetailContent from './complaintDetailContent';
import ModalMSG from '../components/modalMSG';
import config from '../../config';


const TabButton = ({ active, onClick, children }) => (
  <button
    className={`px-4 py-2 text-lg ${active ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'
      }`}
    onClick={onClick}
    style={{ fontFamily: "NanumSquareExtraBold" }}
  >
    {children}
  </button>
);

const ComplaintDetailModal = ({ show, onClose, complaint, onStatusChange }) => {
  const { token } = useAuth();
  const { storeID } = useStore();
  const [activeTab, setActiveTab] = useState('details');
  const [department, setDepartment] = useState('');
  const [newStatus, setNewStatus] = useState();
  const [transferDepartModal, setTransferDepartModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log("complaint : ", complaint);
  })

  useEffect(() => {
    if (storeID && token) {
      fetchPublicDepartment({ storeID }, token, setDepartment);
    }
  }, [storeID, token]);

  // Complaint가 변경되면 newStatus를 초기화
  useEffect(() => {
    if (complaint) {
      setNewStatus(complaint.status || ''); // complaint가 null이 아닐 때만 상태 초기화
    }
  }, [complaint]);

  const handleStatusChange = async () => {
    if (!complaint) return;

    if (complaint.status === newStatus) {
      setErrorMessage("현재 상태와 동일한 상태로 변경할 수 없습니다.");
      return;
    }

    try {
      await axios.patch(
        `${config.apiDomain}/public/complaints/${complaint.complaint_id}/status/`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("상태가 성공적으로 업데이트되었습니다.");
      setShowMessageModal(true);

      // 상태 변경 성공 시 부모 컴포넌트로 콜백 호출
      if (onStatusChange) {
        onStatusChange();
      }

    } catch (error) {
      console.error("Error during status update:", error);

      // 서버에서 반환된 오류 메시지가 있는 경우 이를 표시
      const serverMessage = error.response?.data?.message || error.response?.data?.error;
      setErrorMessage(serverMessage || "상태 업데이트 중 오류가 발생했습니다.");
    }
  };

  const handleAnswer = async () => {
    if (!complaint) return;

    try {
      // 백엔드로 답변 내용 및 전화번호 전송
      await axios.post(
        `${config.apiDomain}/public/complaints-answer/`,
        {
          complaint_id: complaint.complaint_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 성공 메시지
      setMessage("답변이 성공적으로 전송되었습니다.");
      setShowMessageModal(true);
    } catch (error) {
      console.error("답변 전송 중 오류:", error);
      const serverMessage = error.response?.data?.message || error.response?.data?.error;
      setErrorMessage(serverMessage || "답변 전송 중 오류가 발생했습니다.");
    }
  };


  const handleMessageModalClose = () => {
    setShowMessageModal(false);
    setMessage('');
    handleClose();
  };

  const handleClose = () => {
    setNewStatus(complaint?.status || ''); // 상태 초기화
    setErrorMessage(''); // 에러 메시지 초기화
    onClose(); // 부모 컴포넌트의 onClose 호출 (데이터 다시 로드 포함)
  };


  const handleTransfer = () => {
    //console.log(`Transferring complaint ID: ${complaint.complaint_id}`);
    setMessage('민원이 성공적으로 이관되었습니다.');
    setShowMessageModal(true);
    setTransferDepartModal(false); // TransferDepartmentModal 닫기
  };

  if (!show || !complaint) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-2 z-50">
      <div className="relative bg-white rounded-lg shadow-lg w-full md:w-1/2 p-6">
        <div className="flex flex-col space-y-4 justify-start items-start mt-5 md:mt-0 mb-4">
          <div className="flex flex-col space-y-1">
            <h2 className="text-xl md:text-2xl font-bold" style={{ fontFamily: "NanumSquareExtraBold" }}>{complaint.title}</h2>
            <p className="text-sm text-gray-600 px-2" style={{ fontFamily: "NanumSquareBold" }}>
              접수 번호 : {complaint.complaint_number}
            </p>
          </div>
          <X
            className="absolute top-4 right-4 h-6 w-6 bg-indigo-500 rounded-full text-white p-1 cursor-pointer"
            onClick={handleClose}
          />

          <ComplaintDetailTabs activeTab={activeTab} setActiveTab={setActiveTab}>
            <TabButton tabKey="details">상세 정보</TabButton>
            <TabButton tabKey="response">답변</TabButton>
            <TabButton tabKey="transfer">이관</TabButton>
          </ComplaintDetailTabs>

          <ComplaintDetailContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            complaint={complaint}
            department={department}
            newStatus={newStatus}
            setNewStatus={setNewStatus}
            handleStatusChange={handleStatusChange}
            handleAnswer={handleAnswer}
            handleTransfer={handleTransfer}
            errorMessage={errorMessage}
          />

        </div>
      </div>

      <ModalMSG
        show={showMessageModal}
        onClose={handleMessageModalClose}
        title="Success"
      >
        <p style={{ whiteSpace: 'pre-line' }}>
          {message}
        </p>
      </ModalMSG>
    </div>
  );
};

export default ComplaintDetailModal;
