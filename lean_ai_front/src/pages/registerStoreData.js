import { useState, useRef } from 'react';
import { ArrowDown, Upload } from "lucide-react";
import { useAuth } from '@/contexts/authContext';
import ModalMSG from '@/components/modal/modalMSG';
import ModalErrorMSG from '@/components/modal/modalErrorMSG';
 
const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

export default function RegisterStoreData() {
  const { token } = useAuth();
  const [fileNames, setFileNames] = useState([]); // 업로드된 파일 이름 목록 상태
  const [message, setMessage] = useState(''); // 성공 메시지 상태
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 모달 상태
  const [showMessageModal, setShowMessageModal] = useState(false); // 성공 모달 상태

  const fileInputRef = useRef(null); // 파일 입력 참조

  // 파일 변경 시 호출되는 함수
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // 파일을 배열로 변환
    const names = files.map((file) => file.name); // 파일 이름만 추출
    setFileNames(names);  // 파일 이름 상태 업데이트
  };

  // 파일 입력을 초기화하는 함수
  const resetForm = () => {
    setFileNames([]);
    if (fileInputRef.current) fileInputRef.current.value = ''; // 파일 입력 값 초기화
  };
  
  // 양식 파일을 다운로드하는 함수
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/templates/mumul_service_data_guideline_2.xlsx'; // 다운로드할 파일 경로
    
    // 다운로드 파일명 설정
    link.download = '[무물] 초기 데이터 입력 양식.xlsx';
    
    document.body.appendChild(link); // a 태그를 DOM에 추가
    link.click(); // 파일 다운로드 실행
    document.body.removeChild(link); // 클릭 후 a 태그 삭제
  };
  
  // 업로드된 파일을 서버로 제출하는 함수
  const handleSubmit = async () => {
    const files = fileInputRef.current?.files;
  
    if (!files || files.length === 0) {
      setErrorMessage('파일을 업로드 해주세요.');
      setShowErrorMessageModal(true);
      return;
    }
  
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));
  
    try {
      const response = await fetch(`${API_DOMAIN}/api/register-data/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
  
      if (response.ok) {
        const result = await response.json();
  
        const successMessages = result.results
          .filter((r) => r.status === "success")
          .map((r) => `✅ ${r.file}: \n ${r.message}`)
          .join('\n');
  
        const errorMessages = result.results
          .filter((r) => r.status === "error")
          .map((r) => `❌ ${r.file}: \n ${r.message}`)
          .join('\n');
  
        if (errorMessages) {
          setErrorMessage(`다음 파일 처리 중 오류가 발생했습니다:\n${errorMessages}`);
          setShowErrorMessageModal(true);
        }
  
        if (successMessages) {
          setMessage(`성공적으로 업로드되었습니다.`);
          setShowMessageModal(true);
        }
  
        resetForm();
      } else {
        const errorData = await response.json();
        setErrorMessage(
          errorData.error || '파일 업로드에 실패했습니다.'
        );
        setShowErrorMessageModal(true);
      }
    } catch (error) {
      console.error('요청 전송 중 오류 발생:', error);
      setErrorMessage('전송 중 오류가 발생했습니다.');
      setShowErrorMessageModal(true);
    }
  };
  
  return (
    <div className="flex flex-col space-y-10 w-full max-w-md p-8 bg-white rounded-lg items-center justify-center space-y-5">
      {/* 페이지 제목 */}
      <h1 className="text-3xl font-bold text-indigo-600 text-center mt-7" style={{ fontFamily: 'NanumSquareExtraBold' }}>
        데이터 등록하기
      </h1>

      <main className=" space-y-6">
        {/* 양식 다운로드 섹션 */}
        <div className="space-y-3 py-8">
          <h2 className="text-xl font-semibold">데이터 등록 양식 다운로드</h2>
          <p className="text-sm text-gray-500">
            데이터 등록에 필요한 양식을 <br /> 다운로드하려면 아래 버튼을 클릭하세요.
          </p>
          <button
            onClick={handleDownload}
            className="w-full py-2 px-4 rounded flex bg-indigo-500 text-white items-center justify-center transition duration-300"
          >
            <ArrowDown className="mr-2 h-4 w-4" /> <span className="font-medium hover:font-bold hover:underline"> 양식 다운로드 </span>
          </button>
        </div>

        <hr className="border-t-2 border-gray-300 w-full " />

        {/* 파일 업로드 섹션 */}
        <div className="space-y-3 py-8 ">
          <h2 className="text-xl font-semibold">파일 업로드</h2>
          <p className="text-sm text-gray-500">
            작성한 양식을 업로드하려면 <br /> 파일을 선택하고 업로드 버튼을 클릭하세요.
          </p>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <input
              ref={fileInputRef} // 파일 입력 참조
              type="file"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-gray-700
                  hover:file:bg-indigo-100 cursor-pointer"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={fileNames.length === 0} // 파일이 없는 경우 비활성화
            className={`w-full py-2 px-4 rounded flex items-center justify-center transition duration-300 ${
              fileNames.length > 0
                ? 'bg-indigo-500 hover:bg-indigo-600 text-white font-bold' // 활성화 스타일
                : 'bg-gray-300 text-gray-500 cursor-not-allowed' // 비활성화 스타일
            }`}
          >
            <Upload className="mr-2 h-4 w-4" /> 파일 업로드
          </button>

          {/* 업로드된 파일 목록 표시 */}
          {fileNames.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600">
            {fileNames.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
          )}
        </div>
      </main>

      {/* 성공 메시지 모달 */}
      <ModalMSG
        show={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        title="Success"
      >
        <p style={{ whiteSpace: 'pre-line' }}>{message}</p>
      </ModalMSG>

      {/* 에러 메시지 모달 */}
      <ModalErrorMSG
        show={showErrorMessageModal}
        onClose={() => setShowErrorMessageModal(false)}
        title="Error"
      >
        <p style={{ whiteSpace: 'pre-line' }}>{errorMessage}</p>
      </ModalErrorMSG>
    </div>
  );
}
