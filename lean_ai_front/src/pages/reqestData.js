import { useState, useRef } from 'react';
import { ArrowDown, Upload } from "lucide-react";
import ModalMSG from '../components/modalMSG';
import ModalErrorMSG from '../components/modalErrorMSG';
import config from '../../config';

export default function DataEditPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
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
        setTitle('');
        setContent('');
        setFileNames([]);
        if (fileInputRef.current) fileInputRef.current.value = ''; // 파일 입력 초기화
    };

    const handleSubmit = async () => {
        const files = fileInputRef.current?.files;

        console.log('제목:', title);
        console.log('내용:', content);
        console.log('파일 목록:', files);

        // 제목, 내용, 파일 중 하나라도 있는지 확인
        if (!title && !content && (!files || files.length === 0)) {
            setErrorMessage('제목, 요청 내용 또는 파일 중 하나는 반드시 입력해야 합니다.');
            setShowErrorMessageModal(true);
            return;
        }

        const formData = new FormData();
        if (title) formData.append('title', title);
        if (content) formData.append('content', content);
        if (files) {
            Array.from(files).forEach((file) => formData.append('files', file));
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
        <div className="flex flex-col w-full max-w-md p-8 bg-white rounded-lg items-center justify-center">
            <h1 className="text-3xl font-bold text-indigo-600 text-center mb-6" style={{ fontFamily: 'NanumSquareExtraBold' }}>
                서비스 요청하기
            </h1>

            <main className="w-full space-y-6">
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

                <div className="flex flex-col space-y-2">
                    <input
                        ref={fileInputRef}
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

                <div className="text-center">
                    <button
                        onClick={handleSubmit}
                        className="bg-indigo-500 text-white font-medium py-3 px-6 rounded-lg w-full"
                    >
                        요청하기
                    </button>
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
