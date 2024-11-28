import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/authContext';
import { useStore } from '../contexts/storeContext';
import { fetchFeedImage } from '../fetch/fetchStoreFeed';
import ModalMSG from '../components/modal/modalMSG';
import ModalErrorMSG from '../components/modal/modalErrorMSG';
import FeedUpload from '../components/component/feedUpload';
import FeedEdit from '../components/component/feedEdit';
import config from '../../config';

const ModifyFeed = () => {
    const router = useRouter();
    const { token } = useAuth();
    const { storeID } = useStore();
    const [selectedTab, setSelectedTab] = useState('피드추가');
    const [images, setImages] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleMessageModalClose = () => {
        setShowMessageModal(false);
        setMessage('');
    };

    const handleErrorModalClose = () => {
        setShowErrorModal(false);
        setErrorMessage('');
    };

    const fetchImages = async () => {
        setLoading(true);
        try {
            await fetchFeedImage({ storeID }, token, setImages);
        } catch (error) {
            console.error('이미지를 다시 불러오는 중 오류 발생:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (storeID) {
            fetchImages();
        }
    }, [storeID]);

    const handleUpload = async (formData) => {
        setLoading(true);
        try {
            formData.append('store_id', storeID);

            const response = await axios.post(`${config.apiDomain}/api/feed-upload/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage('이미지 업로드 성공');
            setShowMessageModal(true);

            // 데이터 새로 고침
            await fetchImages();
        } catch (error) {
            setErrorMessage('이미지 업로드에 실패했습니다.');
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name, ext) => {
        const full_id = `${name}_${id}${ext}`;

        setLoading(true);
        try {
            await axios.delete(`${config.apiDomain}/api/feed-delete/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                data: { id: full_id, store_id: storeID },
            });

            setMessage('이미지 삭제 성공');
            setShowMessageModal(true);

            // 데이터 새로 고침
            await fetchImages();
        } catch (error) {
            setErrorMessage('이미지 삭제에 실패했습니다.');
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleRename = async (id, oldName, newName, ext) => {
        const full_id = `${oldName}_${id}${ext}`;

        setLoading(true);
        try {
            await axios.put(
                `${config.apiDomain}/api/feed-rename/`,
                { id: full_id, name: newName, store_id: storeID },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setMessage('이미지 이름 변경 성공');
            setShowMessageModal(true);

            // 데이터 새로 고침
            await fetchImages();
        } catch (error) {
            setErrorMessage('이미지 이름 변경에 실패했습니다.');
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-6 font-sans bg-violet-50">
            <div className="flex flex-col space-y-6 w-full py-12 px-6 shadow-md rounded-lg bg-white">
                <div className="flex items-center">
                    <ChevronLeft
                        className="h-6 w-6 md:h-8 md:w-8 text-indigo-700 cursor-pointer mr-2"
                        onClick={() => router.back()}
                    />
                    <h1 className="text-xl md:text-3xl font-bold text-center text-indigo-600">
                        피드 이미지 관리
                    </h1>
                </div>

                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/4 pr-4">
                        <div className="flex flex-col space-y-2">
                            {['피드추가', '피드수정'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedTab(tab)}
                                    className={`px-2 py-2 w-full text-center md:text-left rounded-lg text-indigo-700 ${selectedTab === tab
                                        ? 'bg-indigo-100 text-lg md:text-xl'
                                        : 'hover:bg-gray-100'
                                        }`}
                                    style={{
                                        fontFamily: selectedTab === tab ? 'NanumSquareExtraBold' : 'NanumSquareBold',
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="w-full md:w-3/4">
                        {selectedTab === '피드추가' && (
                            <div className="flex justify-center items-start">
                                <FeedUpload onUpload={handleUpload} />
                            </div>
                        )}
                        {selectedTab === '피드수정' && (
                            <FeedEdit images={images} onDelete={handleDelete} onRename={handleRename} />
                        )}
                    </div>
                </div>
            </div>

            <ModalMSG show={showMessageModal} onClose={handleMessageModalClose} title="Success">
                <p style={{ whiteSpace: 'pre-line' }}>{message}</p>
            </ModalMSG>

            <ModalErrorMSG show={showErrorModal} onClose={handleErrorModalClose} title="Error">
                <p style={{ whiteSpace: 'pre-line' }}>{errorMessage}</p>
            </ModalErrorMSG>
        </div>
    );
};

export default ModifyFeed;
