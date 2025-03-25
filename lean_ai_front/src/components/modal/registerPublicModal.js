import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ModalMSG from '@/components/modal/modalMSG';
import ModalErrorMSG from '@/components/modal/modalErrorMSG';
import FileInput from '@/components/component/ui/fileInput';
import TextInput from '@/components/component/ui/textInput';

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

export default function RegisterCorpModal({ show, onClose }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        corpName: '',
        corpAddress: '',
        corpTel: '',
        corpLogo: null,
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // ✅ 로딩 상태 추가

    const handleMessageModalClose = () => {
        setShowMessageModal(false);
        setMessage('');
        onClose();
        router.reload();
    };

    const handleErrorModalClose = () => {
        setShowErrorModal(false);
        setErrorMessage('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (file) => {
        setFormData({ ...formData, corpLogo: file });
    };

    const handleRegisterPublic = async () => {
        try {
            if (!formData.corpName || !formData.corpAddress || !formData.corpTel) {
                setErrorMessage('필수 항목들을 기입해주시길 바랍니다');
                setShowErrorModal(true);
                return;
            }

            setIsLoading(true); // ✅ 로딩 시작

            const formPayload = new FormData();
            formPayload.append('corp_name', formData.corpName);
            formPayload.append('corp_address', formData.corpAddress);
            formPayload.append('corp_tel', formData.corpTel);
            if (formData.corpLogo) {
                formPayload.append('logo', formData.corpLogo);
            }

            const response = await axios.post(`${API_DOMAIN}/corp/corporations/`, formPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.status === "success") {
                setMessage('입력하신 기업 정보가 등록되었습니다.');
                setShowMessageModal(true);
            } else {
                throw new Error('등록 중 오류가 발생했습니다.');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMsg = error.response.data.public_name || '기업 등록 중 오류가 발생했습니다. 다시 시도해주세요.';
                setErrorMessage(errorMsg);
            } else {
                setErrorMessage('기업 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
            setShowErrorModal(true);
        } finally {
            setIsLoading(false); // ✅ 로딩 종료
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-center mb-4">
                    <h1 className="text-2xl font-bold text-indigo-600 mb-2" style={{ fontFamily: "NanumSquareExtraBold" }}>기업 등록</h1>
                    <p className="text-gray-600" style={{ fontFamily: "NanumSquareBold" }}>기업 정보를 기입해주세요</p>
                </div>

                <div className="space-y-3" style={{ fontFamily: "NanumSquareBold" }}>
                    <TextInput 
                        id="corpName"
                        name="corpName"
                        label="기업 이름"
                        placeholder="기업명"
                        value={formData.corpName}
                        onChange={handleInputChange}
                    />
                    <TextInput
                        id="corpAddress"
                        name="corpAddress"
                        label="주소"
                        placeholder="주소"
                        value={formData.corpAddress}
                        onChange={handleInputChange}
                    />
                    <TextInput
                        id="corpTel"
                        name="corpTel"
                        label="대표번호"
                        placeholder="대표번호"
                        value={formData.corpTel}
                        onChange={handleInputChange}
                    />
                    <FileInput
                        id="corpLogo"
                        name="corpLogo"
                        label="기업 로고"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="flex justify-between mt-5">
                    <button
                        className="w-1/2 bg-gray-400 text-white font-medium py-2 px-4 rounded-lg mr-2"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        취소
                    </button>
                    <button
                        className={`w-1/2 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600'} text-white font-medium py-2 px-4 rounded-lg`}
                        onClick={handleRegisterPublic}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                등록 중...
                            </div>
                        ) : '등록하기'}
                    </button>
                </div>

                <ModalMSG
                    show={showMessageModal}
                    onClose={handleMessageModalClose}
                    title="Success"
                >
                    <p>{message}</p>
                </ModalMSG>

                <ModalErrorMSG
                    show={showErrorModal}
                    onClose={handleErrorModalClose}
                    title="Error"
                >
                    <p>{errorMessage}</p>
                </ModalErrorMSG>
            </div>
        </div>
    );
}
