import { useState } from 'react';
import Link from 'next/link';
import config from '../../config';

export default function DataEditPage() {
  const [fileName, setFileName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState(''); // 모달 메시지 상태 추가

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(`선택된 파일: ${file.name}`);
    } else {
      setFileName('');
    }
  };

  const openModal = (message) => {
    setModalMessage(message); // 모달 메시지 설정
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage(''); // 모달 메시지 초기화
  };

  // 폼과 파일 입력을 초기화하는 함수
  const resetForm = () => {
    setFileName('');
    setTitle('');
    setContent('');
    document.getElementById('fileInput').value = ''; // 파일 입력 초기화
  };

  // 3. 파일, 제목, 내용 모두 업로드
  const handleSubmit = async () => {
    if (!title && !content) {
      openModal('요청 사항을 입력해주세요.'); // 입력이 없는 경우 경고 모달 표시
      return;
    }

    const formData = new FormData();
    const fileInput = document.getElementById('fileInput');

    formData.append('title', title);
    formData.append('content', content);
    
    if (fileInput.files[0]) {
      formData.append('file', fileInput.files[0]);
    }

    try {
      const response = await fetch(`${config.localhosts}/api/edit/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        openModal('요청되었습니다!'); // 성공 메시지 모달
        resetForm(); // 요청 성공 후 폼 초기화
      } else {
        const errorData = await response.json(); // 서버에서 반환된 JSON 에러 메시지를 읽음
        if (errorData && errorData.file) {
          openModal(errorData.file[0]); // 서버에서 반환된 파일 관련 에러 메시지 표시
        } else {
          openModal('요청 전송 실패: ' + response.statusText); // 기타 에러 메시지 표시
        }
      }
    } catch (error) {
      console.error('요청 전송 중 오류 발생:', error);
      openModal('요청 전송 중 오류 발생: ' + error.message); // 네트워크 오류 등의 경우
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xs">
        {/* 뒤로가기 버튼 및 제목을 동일선상에 배치 */}
        <div className="mb-4 flex items-center">
          <Link href="/mainPageForPresident" className="text-gray-500">
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
          <input 
            type="text" 
            placeholder="제목 남기기" 
            className="w-full p-3 rounded-lg border mb-4" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea 
            placeholder="내용 입력" 
            className="w-full p-3 rounded-lg border h-32 resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <p className="text-sm text-gray-500 mt-2">*파일이 없으시더라도 수정 요청이 가능합니다.</p>
        </div>

        {/* 요청하기 버튼 */}
        <div className="text-center">
          <button className="bg-red-500 text-white py-3 px-6 rounded-lg font-bold" onClick={handleSubmit}>
            요청하기
          </button>
        </div>
      </div>

      {/* 모달 창 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-center">{modalMessage}</h2>
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
