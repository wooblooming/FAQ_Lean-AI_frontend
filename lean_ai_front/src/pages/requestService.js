import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/authContext';
import { usePublic } from '../contexts/publicContext';
import ModalMSG from '../components/modal/modalMSG';
import ModalErrorMSG from '../components/modal/modalErrorMSG';
import config from '../../config';

export default function RequestService() {
    const { token } = useAuth();
    const { isPublicOn } = usePublic();
    const [title, setTitle] = useState(''); // 제목 상태
    const [content, setContent] = useState(''); // 요청 내용 상태
    const [fileNames, setFileNames] = useState([]); // 파일 이름 목록 상태
    const [message, setMessage] = useState(''); // 성공 메시지 상태
    const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태
    const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 모달 상태
    const [showMessageModal, setShowMessageModal] = useState(false); // 성공 모달 상태
    const fileInputRef = useRef(null); // 파일 입력 참조

    // 파일 변경 시 호출되는 함수
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files); // 선택된 파일을 배열로 변환
        const names = files.map((file) => file.name); // 파일 이름을 배열로 저장
        setFileNames(names); // 파일 이름 상태 업데이트
    };

    // 폼을 초기화하는 함수
    const resetForm = () => {
        setTitle(''); // 제목 초기화
        setContent(''); // 내용 초기화
        setFileNames([]); // 파일 이름 초기화
        if (fileInputRef.current) fileInputRef.current.value = ''; // 파일 입력 값 초기화
    };

    // 제출 버튼 클릭 시 호출되는 함수
    const handleSubmit = async () => {
        const files = fileInputRef.current?.files; // 파일 입력 참조

        // 제목, 내용, 파일 중 하나라도 입력되지 않았을 때 에러 메시지 표시
        if (!title && !content && (!files || files.length === 0)) {
            setErrorMessage('제목, 요청 내용 또는 파일 중 하나는 반드시 입력해야 합니다.');
            setShowErrorMessageModal(true);
            return;
        }

        const formData = new FormData(); // 서버 전송을 위한 FormData 생성
        if (title) formData.append('title', title); // 제목 추가
        if (content) formData.append('content', content); // 내용 추가
        if (files) {
            Array.from(files).forEach((file) => formData.append('files', file)); // 파일 추가
        }

        let fetchUrl; // URL 변수를 선언

        try {
            fetchUrl = isPublicOn ? `${config.apiDomain}/public/request-service/` : `${config.apiDomain}/api/request-service/`;

            const response = await fetch(fetchUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            // 전송 성공 시 성공 메시지 표시 및 폼 초기화
            if (response.ok) {
                setMessage('데이터가 등록되었습니다.');
                setShowMessageModal(true);
                resetForm();
            } else {
                // 전송 실패 시 에러 메시지 표시
                const errorData = await response.json();
                console.error('요청 전송 실패:', errorData);
                setErrorMessage('데이터 등록에 실패했습니다.');
                setShowErrorMessageModal(true);
            }
        } catch (error) {
            // 전송 중 에러 발생 시 에러 메시지 표시
            console.error('요청 전송 중 오류 발생:', error);
            setErrorMessage('전송 중 오류가 발생했습니다.');
            setShowErrorMessageModal(true);
        }
    };

    return (
        <div className="flex flex-col space-y-10 w-full max-w-md p-8 bg-white rounded-lg items-center justify-center">
            {/* 페이지 제목 */}
            <h1 className="text-3xl font-bold text-indigo-600 text-center mt-7" style={{ fontFamily: 'NanumSquareExtraBold' }}>
                서비스 요청하기
            </h1>

            <main className="w-full space-y-6">
                {/* 제목 입력 필드 */}
                <div className="flex flex-col space-y-2">
                    <label htmlFor="title" className="text-lg font-semibold">
                        제목
                    </label>
                    <input
                        id="title"
                        type="text"
                        placeholder="제목을 입력하세요"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* 내용 입력 필드 */}
                <div className="flex flex-col space-y-2">
                    <label htmlFor="content" className="text-lg font-semibold">요청 내용</label>
                    <textarea
                        id="content"
                        placeholder="내용 입력"
                        className="w-full p-3 border rounded-lg h-48 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                </div>

                {/* 파일 입력 필드 */}
                <div className="flex flex-col space-y-4">
                    <input
                        ref={fileInputRef} // 파일 입력 참조
                        id="fileInput"
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

                {/* 제출 버튼 */}
                <div className="text-center">
                    <button
                        onClick={handleSubmit}
                        className="bg-indigo-500 text-white font-medium py-3 px-6  rounded-lg w-full"
                    >
                        요청하기
                    </button>
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
