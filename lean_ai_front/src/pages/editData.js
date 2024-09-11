import { useState } from 'react';
import config from '../../config';

export default function DataEditPage() {
  const [fileName, setFileName] = useState('');
  const [content, setContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(`선택된 파일: ${file.name}`);
    } else {
      setFileName('');
    }
  };

  const openModal = (message) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
  };

  const resetForm = () => {
    setFileName('');
    setContent('');
    document.getElementById('fileInput').value = ''; // 파일 입력 초기화
  };

  const handleSubmit = async () => {
    const fileInput = document.getElementById('fileInput');

    // 파일과 내용이 모두 비어 있는지 확인
    if (!content && !fileInput.files.length) {
      openModal('파일이나 요청 사항 중 하나를 입력해주세요.');
      return;
    }

    const formData = new FormData();

    // 요청 사항이 있으면 추가
    if (content) {
      formData.append('content', content);
    }

    // 파일이 있으면 추가
    if (fileInput.files.length > 0) {
      formData.append('file', fileInput.files[0]);
    }

    try {
      const response = await fetch(`${config.apiDomain}/api/edit/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        openModal('요청되었습니다!');
        resetForm();
      } else {
        console.error('요청 전송 실패:', response.statusText);
      }
    } catch (error) {
      console.error('요청 전송 중 오류 발생:', error);
    }
  };

  return (
    <div className="relative z-10 flex flex-col">
      <div className='fixed inset-0 flex items-center justify-center'>
        <div className="flex flex-col rounded-lg p-8 w-full max-w-md text-center mb-2">
          <div className="rounded-lg p-8 w-full">
            <div className="mb-3 flex items-center justify-center">
              <h1 className="text-2xl font-bold">데이터 수정하기</h1>
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
                className="w-full bg-indigo-300 hover:bg-violet-500 text-white text-center font-medium text-white py-3 rounded-lg "
                onClick={() => document.getElementById('fileInput').click()}
              >
                파일 첨부
              </button>

              <p id="fileName" className="mt-2 text-sm text-gray-700">{fileName}</p>
            </div>

            {/* 요청 사항 폼 */}
            <div className="mb-6">
              <label className="block mb-2 text-left font-semibold">요청 사항</label>
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
              <button className="bg-indigo-300 hover:bg-violet-500 text-white text-center font-medium py-3 px-6 rounded-lg  w-full" onClick={handleSubmit}>
                요청하기
              </button>
            </div>
          </div>
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
