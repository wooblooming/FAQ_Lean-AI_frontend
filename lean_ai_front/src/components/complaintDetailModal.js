import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ComplaintDetailModal = ({ show, onClose, complaint, newStatus, setNewStatus, handleStatusChange }) => {
  if (!show || !complaint) return null;

  const formatAuthorName = (fullName) => {
    if (!fullName || fullName.length === 0) {
      return '';
    }
    const firstCharacter = fullName[0];
    const remainingCharacters = 'O'.repeat(fullName.length - 1);
    return firstCharacter + remainingCharacters;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg w-10/12 max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div className='flex flex-col space-y-1'>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "NanumSquareExtraBold" }}>{complaint.title}</h2>
            <p className="text-sm text-gray-600 px-2" style={{ fontFamily: "NanumSquareBold" }}> 접수 번호 : {complaint.complaint_number}</p>
          </div>
          <X
            className="absolute top-4 right-4 h-6 w-6 bg-indigo-500 rounded-full text-white p-1 cursor-pointer"
            onClick={onClose}
          />
        </div>
        <div className="space-y-4" style={{ fontFamily: "NanumSquareBold" }}>
          <div className="grid gap-3 py-2">
            <div className="grid grid-cols-4 items-center gap-4" >
              <span className="font-bold">작성자:</span>
              <span className="col-span-3" style={{ fontFamily: "NanumSquare" }}> {formatAuthorName(complaint.name)}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">접수일:</span>
              <span className='whitespace-nowrap'style={{ fontFamily: "NanumSquare" }}>{new Date(complaint.created_at).toISOString().replace('T', ' ').substring(0, 16)}</span>
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
                  className='px-3 '
                  size="sm"
                  onClick={() => handleStatusChange(complaint.complaint_id, newStatus)}
                  style={{ fontFamily: "NanumSquareBold" }}
                >
                  변경
                </Button>
              </div>

            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">내용:</span>
              <span className="col-span-3" style={{ fontFamily: "NanumSquare" }}>{complaint.content}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailModal;
