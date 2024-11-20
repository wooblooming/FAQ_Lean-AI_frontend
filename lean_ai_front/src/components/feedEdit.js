import React, { useState, useEffect } from 'react';
import ModalErrorMSG from '../components/modalErrorMSG';

const FeedEdit = ({ images, onDelete, onRename }) => {
    const [newName, setNewName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    // 환경 변수에서 미디어 URL 가져오기
    const mediaBaseUrl = process.env.NEXT_PUBLIC_MEDIA_URL;

    const handleErrorModalClose = () => {
        setShowErrorModal(false);
        setErrorMessage('');
    };

    const handleRename = (id) => {
        if (!newName) {
            setErrorMessage('새 이름을 입력하세요.');
            setShowErrorModal(true);
            return;
        }

        // 이전 이름 찾기
        const image = images.find((img) => img.id === id);
        if (!image) {
            setErrorMessage('이미지를 찾을 수 없습니다.');
            setShowErrorModal(true);
            return;
        }
        const oldName = image.name; // 이전 이름
        const ext = image.ext; // 확장자

        if (oldName === newName) {
            setErrorMessage('새 이름이 이전 이름과 같습니다. 다른 이름을 입력해주세요.');
            setShowErrorModal(true);
            return;
        }

        onRename(id, oldName, newName, ext); // 이전 이름과 새 이름, 확장자 전달
        setNewName('');
    };

    const handleDelete = (id) => {
        // 이미지 파일 이름 찾기
        const image = images.find((img) => img.id === id);
        if (!image) {
            setErrorMessage('이미지를 찾을 수 없습니다.');
            setShowErrorModal(true);
            return;
        }
        const name = image.name; // 이미지 파일 이름
        const ext = image.ext; // 확장자

        onDelete(id, name, ext); // 이미지 파일 이름과 확장자 전달
        setNewName('');
    };

    return (
        <div className="flex flex-col space-y-6">
            {images && images.length > 0 ? (
                images.map((image) => (
                    <div
                        key={image.id} // 고유한 id를 key로 사용
                        className="flex items-center justify-between border p-4 rounded-md"
                    >
                        <div className="flex items-center space-x-4">
                            {/* 이미지 미리보기 */}
                            <img
                                src={`${mediaBaseUrl}/media/${image.path}`} // 이미지 경로 설정
                                alt={image.name}
                                className="w-16 h-16 object-cover rounded-md border"
                            />
                            <p className="font-semibold text-gray-700">{image.name}</p>
                        </div>
                        <div className="flex space-x-4">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="새 파일 이름 입력"
                                className="p-2 border rounded-md"
                            />
                            <button
                                onClick={() => handleRename(image.id)}
                                className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                                style={{ fontFamily: 'NanumSquareBold' }}
                            >
                                이름 변경
                            </button>
                            <button
                                onClick={() => handleDelete(image.id)} // id로 삭제
                                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                style={{ fontFamily: 'NanumSquareBold' }}
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-5">
                    <p
                        className="text-gray-700 text-center text-3xl"
                        style={{ fontFamily: 'NanumSquareBold' }}
                    >
                        저장된 피드가 없습니다
                    </p>
                </div>
            )}

            <ModalErrorMSG show={showErrorModal} onClose={handleErrorModalClose} title="Error">
                <p style={{ whiteSpace: 'pre-line' }}>{errorMessage}</p>
            </ModalErrorMSG>
        </div>
    );
};

export default FeedEdit;
