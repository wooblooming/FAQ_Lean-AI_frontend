import React, { useState, useEffect } from 'react';
import ModalErrorMSG from '../modal/modalErrorMSG';

const FeedEdit = ({ images, onDelete, onRename }) => {
    const [newNames, setNewNames] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleErrorModalClose = () => {
        setShowErrorModal(false);
        setErrorMessage('');
    };

    const handleInputChange = (id, value) => {
        setNewNames((prev) => ({ ...prev, [id]: value }));
    };

    const handleRename = (id) => {
        const newName = newNames[id];

        if (!newName) {
            setErrorMessage('새 이름을 입력하세요.');
            setShowErrorModal(true);
            return;
        }

        const image = images.find((img) => img.id === id);
        if (!image) {
            setErrorMessage('이미지를 찾을 수 없습니다.');
            setShowErrorModal(true);
            return;
        }

        const oldName = image.name;
        if (oldName === newName) {
            setErrorMessage('새 이름이 이전 이름과 같습니다. 다른 이름을 입력해주세요.');
            setShowErrorModal(true);
            return;
        }

        onRename(id, oldName, newName, image.ext);
        setNewNames((prev) => ({ ...prev, [id]: '' }));
    };

    const handleDelete = (id) => {
        const image = images.find((img) => img.id === id);
        if (!image) {
            setErrorMessage('이미지를 찾을 수 없습니다.');
            setShowErrorModal(true);
            return;
        }
        onDelete(id, image.name, image.ext);
        setNewNames((prev) => {
            const updatedNames = { ...prev };
            delete updatedNames[id];
            return updatedNames;
        });
    };

    return (
        <div className="flex flex-col space-y-4 ">
            {images && images.length > 0 ? (
                images.map((image) => (
                    isMobile ? (
                        // 모바일 전용 UI
                        <div
                            key={image.id}
                            className="flex flex-col border p-3 rounded-md space-y-3"
                        >
                            <img
                                src={`${MEDIA_URL}/media/${image.path}`}
                                alt={image.name}
                                className="w-full h-32 object-contain rounded-md border"
                            />
                            <div className="flex flex-col space-y-2">
                                <p className="font-semibold text-gray-700 text-lg text-center">
                                    {image.name}
                                </p>
                                <input
                                    type="text"
                                    value={newNames[image.id] || ''}
                                    onChange={(e) => handleInputChange(image.id, e.target.value)}
                                    placeholder="새 파일 이름 입력"
                                    className="p-2 border rounded-md text-sm"
                                />
                                <div className="flex justify-between">
                                    <button
                                        onClick={() => handleRename(image.id)}
                                        className="px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 text-sm"
                                    >
                                        이름 변경
                                    </button>
                                    <button
                                        onClick={() => handleDelete(image.id)}
                                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // 데스크톱 전용 UI
                        <div
                            key={image.id}
                            className="flex items-center justify-between border p-4 rounded-md"
                        >
                            <div className="flex items-center space-x-4">
                                <img
                                    src={`${MEDIA_URL}/media/${image.path}`}
                                    alt={image.name}
                                    className="w-16 h-16 object-cover rounded-md border"
                                />
                                <p className="font-semibold text-lg text-gray-700 w-32 whitespace-pre-line">{image.name}</p>
                            </div>
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    value={newNames[image.id] || ''}
                                    onChange={(e) => handleInputChange(image.id, e.target.value)}
                                    placeholder="새 파일 이름 입력"
                                    className="p-2 border rounded-md"
                                />
                                <button
                                    onClick={() => handleRename(image.id)}
                                    className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 whitespace-nowrap"
                                >
                                    이름 변경
                                </button>
                                <button
                                    onClick={() => handleDelete(image.id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 whitespace-nowrap"
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    )
                ))
            ) : (
                <div className="p-5">
                    <p
                        className="text-gray-700 text-center text-3xl"
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
