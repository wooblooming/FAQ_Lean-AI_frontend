import { useState, useRef } from 'react';
import { ArrowDown, Upload } from "lucide-react";
import ModalMSG from '../components/modalMSG';
import ModalErrorMSG from '../components/modalErrorMSG';
import config from '../../config';

export default function DataEditPage() {
  const [fileNames, setFileNames] = useState([]);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const fileInputRef = useRef(null); // useRef로 파일 입력 참조

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const names = files.map((file) => file.name);
    setFileNames(names);
  };

  const resetForm = () => {
    setFileNames([]);
    if (fileInputRef.current) fileInputRef.current.value = ''; // 파일 입력 초기화
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/templates/mumul_service_data_guideline.xlsx'; 
    link.download = 'mumul_service_data_guideline.xlsx';
    link.click();
  };
  

  const handleSubmit = async () => {
    const files = fileInputRef.current?.files; // 파일 참조
    console.log("click button");

    if (!files || files.length === 0) {
      setErrorMessage('파일을 업로드 해주세요.');
      setShowErrorMessageModal(true);
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));

    // FormData 데이터 출력
    console.log('FormData에 포함된 데이터:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    console.log(config.apiDomain);

    try {
      const response = await fetch(`${config.apiDomain}/api/edit/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        }
      });

      if (response.ok) {
        setMessage('데이터가 등록되었습니다!');
        setShowMessageModal(true);
        resetForm();
      } else {
        const errorData = await response.json();
        console.error('요청 전송 실패:', errorData);
        setErrorMessage('데이터 등록에 실패했습니다.');
        setShowErrorMessageModal(true);
      }
    } catch (error) {
      console.error('요청 전송 중 오류 발생:', error);
      setErrorMessage('전송 중 오류가 발생했습니다.');
      setShowErrorMessageModal(true);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md px-2 py-8 bg-white rounded-lg items-center justify-center space-y-5">
      <h1 className="text-3xl font-bold text-indigo-600 text-center " style={{ fontFamily: 'NanumSquareExtraBold' }}>
        데이터 등록하기
      </h1>

      <main className="p-4 space-y-16">
        <div className="space-y-2 mt-4">
          <h2 className="text-xl font-semibold">데이터 등록 양식 다운로드</h2>
          <p className="text-sm text-gray-500">
            데이터 등록에 필요한 양식을 <br /> 다운로드하려면 아래 버튼을 클릭하세요.
          </p>
          <button
            onClick={handleDownload}
            className="w-full py-2 px-4 rounded flex bg-indigo-500 text-white  items-center justify-center transition duration-300"
          >
            <ArrowDown className="mr-2 h-4 w-4" /> <span className="font-medium hover:font-bold hover:underline"> 양식 다운로드 </span>
          </button>
        </div>

        <div className="border-t border-gray-300 "></div>

        <div className="space-y-3 ">
          <h2 className="text-xl font-semibold">파일 업로드</h2>
          <p className="text-sm text-gray-500">
            작성한 양식을 업로드하려면 <br /> 파일을 선택하고 업로드 버튼을 클릭하세요.
          </p>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <input
              ref={fileInputRef} // useRef로 파일 입력 참조
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
            disabled={fileNames.length === 0}
            className={`w-full py-2 px-4 rounded flex items-center justify-center transition duration-300 ${
              fileNames.length > 0
                ? 'bg-indigo-500 hover:bg-indigo-600 text-white font-bold'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Upload className="mr-2 h-4 w-4" /> 파일 업로드
          </button>

          {fileNames.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              선택된 파일: {fileNames.join(', ')}
            </p>
          )}
        </div>
      </main>

      <ModalMSG
        show={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        title="Success"
      >
        <p style={{ whiteSpace: 'pre-line' }}>{message}</p>
      </ModalMSG>

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