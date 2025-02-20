import React from 'react';
import TransferDepartmentModal from '../../modal/transferDepartModal';
import { Button } from "@/components/ui/button";


const Textarea = ({ value, placeholder, readOnly = false, onChange }) => (
    <div className="mb-4 w-full">
      <textarea
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
        onChange={onChange}
      />
    </div>
  );
  
const ComplaintDetailContent = ({ 
      activeTab, setActiveTab, 
      complaint, department,
      newStatus, setNewStatus, handleStatusChange, 
      handleAnswer, answer, setAnswer, 
      handleTransfer, errorMessage
  }) => {
    const formatAuthorName = (fullName) => {
      if (!fullName || fullName.length === 0) return '';
      const firstCharacter = fullName[0];
      const remainingCharacters = 'O'.repeat(fullName.length - 1);
      return firstCharacter + remainingCharacters;
    };
  
    switch (activeTab) {
      case 'details':
        return (
            <div className="grid gap-3 py-2" style={{ fontFamily: "NanumSquareBold" }}>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">작성자:</span>
              <span className="col-span-3" style={{ fontFamily: "NanumSquare" }}>{formatAuthorName(complaint.name)}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">접수일:</span>
              <span className="whitespace-nowrap" style={{ fontFamily: "NanumSquare" }}>
                {new Date(complaint.created_at).toISOString().replace('T', ' ').substring(0, 16)}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">상태:</span>
              <div className="col-span-3 flex items-center space-x-4" style={{ fontFamily: "NanumSquare" }}>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="bg-gray-100 p-2 rounded text-center"
                >
                  <option value="">변경 상태 선택</option>
                  <option value="접수">접수</option>
                  <option value="처리 중">처리 중</option>
                  <option value="완료">완료</option>
                </select>
                <Button
                  className="px-3"
                  size="sm"
                  onClick={handleStatusChange}
                  style={{ fontFamily: "NanumSquareBold" }}
                >
                  변경
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 ">
              <span className="font-bold">내용:</span>
              <span className="col-span-3"
                style={{ fontFamily: "NanumSquare", width: '85%' }}
              >
                {complaint.content}
              </span>
            </div>

            <div className='flex mt-3'>
              {errorMessage && <p className="text-red-500 ">{errorMessage}</p>}
            </div>
          </div>
        );
  
      case 'response':
        return (
          <div className="space-y-4 w-full">
            <Textarea 
              value={answer} // 부모로부터 받은 상태
              onChange={(e) => setAnswer(e.target.value)} // 부모 상태 업데이트
              placeholder="답변을 입력해주세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
              style={{ fontFamily: "NanumSquare" }}
            />
            <div className="flex justify-end ">
              <Button onClick={handleAnswer} >답변 전송</Button>
            </div>
          </div>
        );
  
      case 'transfer':
        return (
          <TransferDepartmentModal
            show={true}
            onClose={() => setActiveTab('details')}
            depart={department}
            onTransfer={handleTransfer}
            complaintId={complaint?.complaint_id}
          />
        );
  
      default:
        return null;
    }
  };
  
  export default ComplaintDetailContent;
  