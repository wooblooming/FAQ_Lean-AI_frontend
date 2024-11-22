import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/authContext';
import { useStore } from '../contexts/storeContext';
import { X, AlertCircle, CornerDownRight } from 'lucide-react';
import { fetchPublicDepartment } from '../fetch/fetchPublicDepart';
import TransferDepartmentModal from './transferDepartModal';
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

const Input = ({ label, value, readOnly = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      readOnly={readOnly}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

const Textarea = ({ label, value, placeholder, readOnly = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      value={value}
      placeholder={placeholder}
      readOnly={readOnly}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
    />
  </div>
);

const Button = ({ onClick, variant = 'primary', children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md font-semibold ${variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      }`}
  >
    {children}
  </button>
);

const ComplaintDetailModal = ({ show, onClose, complaint, onStatusChange }) => {
  const { token } = useAuth();
  const { storeID } = useStore();
  const [department, setDepartment] = useState('');
  const [newStatus, setNewStatus] = useState();
  const [transferDepartModal, setTransferDepartModal] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [showAnswer, setShowAnswer] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');

  
  
  useEffect(() => {
    if (storeID && token) {
      fetchPublicDepartment({ storeID }, token, setDepartment);
    }
  }, [storeID, token]);

  // Complaint가 변경되면 newStatus를 초기화
  useEffect(() => {
    if (complaint) {
      setNewStatus(complaint.status || ''); // complaint가 존재할 때만 상태 설정
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

  const handleMessageModalClose = () => {
    setShowMessageModal(false);
    setMessage('');
  };

  const handleClose = () => {
    setNewStatus(complaint.status);
    setErrorMessage(''); // 에러 메시지 초기화
    onClose(); // 부모 컴포넌트로부터 전달된 닫기 함수 호출
  };


  const handleTransferModal = () => {
    setTransferDepartModal(true);
  };

  const handleTransferClose = () => {
    setTransferDepartModal(false); const handleStatusChange = async () => {
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

    const handleMessageModalClose = () => {
      setShowMessageModal(false);
      setMessage('');
    };

    const handleClose = () => {
      setNewStatus(complaint.status);
      setErrorMessage(''); // 에러 메시지 초기화
      onClose(); // 부모 컴포넌트로부터 전달된 닫기 함수 호출
    };


    const handleTransferModal = () => {
      setTransferDepartModal(true);
    };

    const handleTransferClose = () => {
      setTransferDepartModal(false);
    };

    const handleTransfer = () => {
      //console.log(`Transferring complaint ID: ${complaint.complaint_id}`);
      setTransferDepartModal(false); // 성공 시 모달 닫기
    };

    if (!show || !complaint) return null;

    const formatAuthorName = (fullName) => {
      if (!fullName || fullName.length === 0) {
        return '';
      }
      const firstCharacter = fullName[0];
      const remainingCharacters = 'O'.repeat(fullName.length - 1);
      return firstCharacter + remainingCharacters;
    };
  };

  const handleTransfer = () => {
    //console.log(`Transferring complaint ID: ${complaint.complaint_id}`);
    setTransferDepartModal(false); // 성공 시 모달 닫기
  };

  if (!show || !complaint) return null;

  const formatAuthorName = (fullName) => {
    if (!fullName || fullName.length === 0) {
      return '';
    }
    const firstCharacter = fullName[0];
    const remainingCharacters = 'O'.repeat(fullName.length - 1);
    return firstCharacter + remainingCharacters;
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="space-y-4 px-2" style={{ fontFamily: "NanumSquare" }}>
            <h2 className="text-xl md:text-2xl font-bold" style={{ fontFamily: "NanumSquareExtraBold" }}>{complaint.title}</h2>
            <div className="grid grid-cols-2 gap-2 px-3">
              <div className="">
                <label className="block text-lg font-medium text-gray-700 " style={{ fontFamily: "NanumSquareBold" }}>접수 번호</label>
                <div className="px-3 py-2 ">{complaint.complaint_number}</div>
              </div>
              <div className="">
                <label className="block text-lg font-medium text-gray-700 " style={{ fontFamily: "NanumSquareBold" }}>작성자</label>
                <div className="px-3 py-2   ">{formatAuthorName(complaint.name)}</div>
              </div>
              <div className="">
                <label className="block text-lg font-medium text-gray-700 " style={{ fontFamily: "NanumSquareBold" }}>접수일</label>
                <div className="px-3 py-2   ">
                  {new Date(complaint.created_at).toISOString().replace('T', ' ').substring(0, 16)}
                </div>
              </div>
            </div>
            <div className="px-3">
              <label className="block text-lg font-medium text-gray-700 " style={{ fontFamily: "NanumSquareBold" }}>내용</label>
              <div className="px-3 py-2 min-h-[50px]">{complaint.content}</div>
            </div>
          </div>
        );

      case 'response':
        return (
          <div className="space-y-4">
            <Textarea label="답변" placeholder="답변을 입력해주세요" />
            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setStatus('처리중')}>
                임시 저장
              </Button>
              <Button onClick={() => setStatus('완료')}>답변 완료</Button>
            </div>
          </div>
        );
      case 'transfer':
        return (
          <div className="space-y-4">
            <Input label="이관 부서" placeholder="이관할 부서를 입력하세요" />
            <Textarea label="이관 사유" placeholder="이관 사유를 입력하세요" />
            <Button onClick={() => alert('민원이 이관되었습니다.')}>민원 이관하기</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center space-y-4">
          <h2 className="text-3xl text-gray-800"  style={{ fontFamily: "NanumSquareExtraBold" }}>민원 상세</h2>
          <span className={`px-2 py-1 rounded-full text-sm font-semibold 
            ${complaint?.status === '접수' ? 'bg-purple-100 text-purple-800' :
              complaint?.status === '처리중' ? 'bg-indigo-100 text-indigo-800' :
                ' bg-pink-100 text-pink-800'
            }`}>
            {complaint?.status || '알 수 없음'}
          </span>
        </div>
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex">
            <TabButton
              active={activeTab === 'details'}
              onClick={() => setActiveTab('details')}
            >
              상세 정보
            </TabButton>
            <TabButton
              active={activeTab === 'response'}
              onClick={() => setActiveTab('response')}
            >
              답변
            </TabButton>
            <TabButton
              active={activeTab === 'transfer'}
              onClick={() => setActiveTab('transfer')}
            >
              이관
            </TabButton>
          </nav>
        </div>
        {renderTabContent()}
      </div>
    </div>
  );
}


export default ComplaintDetailModal;