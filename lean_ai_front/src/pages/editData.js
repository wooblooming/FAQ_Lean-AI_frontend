import { useState } from 'react';
import config from '../../config';

export default function DataEditPage() {
  const [fileNames, setFileNames] = useState([]); // 여러 파일 이름 저장
  const [content, setContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // 여러 파일 배열로 변환
    const names = files.map((file) => file.name); // 파일 이름 배열 생성
    setFileNames(names);
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
    setFileNames([]);
    setContent('');
    document.getElementById('fileInput').value = ''; // 파일 입력 초기화
  };

  const handleSubmit = async () => {
    const fileInput = document.getElementById('fileInput');

    if (!content && !fileInput.files.length) {
      openModal('파일이나 요청 사항 중 하나를 입력해주세요.');
      return;
    }

    const formData = new FormData();

    if (content) {
      formData.append('content', content);
    }

    Array.from(fileInput.files).forEach((file) => {
      formData.append('files', file); // 여러 파일 추가
    });

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
        <div className="flex flex-col rounded-lg p-8 w-full max-w-md text-center space-y-4">
          <div className="rounded-lg p-8 w-full">
            <div className="mb-3 flex items-center justify-center">
              <h1 className="text-3xl font-bold text-indigo-600 text-center cursor-pointer" style={{ fontFamily: 'NanumSquareExtraBold' }}>
                데이터 등록하기
              </h1>
            </div>

            <p className="text-sm text-gray-600 text-center">아래 버튼을 눌러 파일을 첨부해주세요.</p>

            <div className="mb-6">
              <input
                type="file"
                id="fileInput"
                className="hidden"
                multiple // 여러 파일 업로드 허용
                onChange={handleFileChange}
              />

              <button
                className="w-full bg-indigo-500 text-white text-center font-medium py-3 rounded-lg"
                onClick={() => document.getElementById('fileInput').click()}
              >
                파일 첨부
              </button>

              <p className="mt-2 text-sm text-gray-700">
                {fileNames.length > 0
                  ? `선택된 파일: ${fileNames.join(', ')}`
                  : '선택된 파일이 없습니다.'}
              </p>
            </div>

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

            <div className="text-center">
              <button className="bg-indigo-500 text-white text-center font-medium py-3 px-6 rounded-lg w-full" onClick={handleSubmit}>
                요청하기
              </button>
            </div>
          </div>
        </div>
      </div>

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
