import { useState } from 'react';
import Link from 'next/link';

export default function DataEditPage() {
  const [fileName, setFileName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(`선택된 파일: ${file.name}`);
    } else {
      setFileName('');
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xs">
        {/* 뒤로가기 버튼 및 제목을 동일선상에 배치 */}
        <div className="mb-4 flex items-center">
          <Link href="/myPage" className="text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
          </Link>
          <h1 className="text-xl font-bold flex-grow text-center">데이터 수정하기</h1>
        </div>

        {/* 설명 텍스트 */}
        <p className="text-sm text-gray-600 mb-6 text-center">아래 버튼을 눌러 파일을 첨부해주세요.</p>

        {/* 파일 첨부 버튼 */}
        <div className="mb-6">
          <input 
            type="file" 
            id="fileInput" 
            className="hidden" 
            onChange={handleFileChange} 
          />

          <button 
            className="w-full bg-red-500 text-white py-3 rounded-lg font-bold" 
            onClick={() => document.getElementById('fileInput').click()}
          >
            파일 첨부
          </button>

          <p id="fileName" className="mt-2 text-sm text-gray-700">{fileName}</p>
        </div>

        {/* 요청 사항 폼 */}
        <div className="mb-6">
          <label className="block mb-2 text-left font-semibold">요청 사항</label>
          <input type="text" placeholder="제목 남기기" className="w-full p-3 rounded-lg border mb-4" />
          <textarea placeholder="내용 입력" className="w-full p-3 rounded-lg border h-32 resize-none"></textarea>
          <p className="text-sm text-gray-500 mt-2">*파일이 없으시더라도 수정 요청이 가능합니다.</p>
        </div>

        {/* 요청하기 버튼 */}
        <div className="text-center">
          <button className="bg-red-500 text-white py-3 px-6 rounded-lg font-bold" onClick={openModal}>
            요청하기
          </button>
        </div>
      </div>

      {/* 모달 창 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-center">요청되었습니다!</h2>
            <div className="text-center">
              <button className="bg-red-500 text-white py-2 px-4 rounded-lg" onClick={closeModal}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
