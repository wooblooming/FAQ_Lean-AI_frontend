import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft } from 'lucide-react';
import TermsOfServiceModal from '../components/termsOfServiceModal';
import MarketingModal from '../components/marketingModal';
import ModalMSG from '../components/modalMSG';
import ModalErrorMSG from '../components/modalErrorMSG';
import config from '../../config';

const SignupStep2 = () => {
    const router = useRouter();
    const { username, password, name, dob, phone, email } = router.query;

    const [formData, setFormData] = useState({
        businessType: '', businessName: '', address: ''
    });
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [marketingAccepted, setMarketingAccepted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showWarning, setShowWarning] = useState(false); // 경고 메시지 상태
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showMarketingModal, setShowMarketingModal] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'businessType' && value !== '') {
            setShowWarning(false); // 선택 시 경고 메시지 숨김
        }
    };

    const handleTermsCheckboxChange = () => setShowTermsModal(true);

    const handleSignup = async () => {
        const { businessType, businessName, address } = formData;

        if (!businessType) {
            setShowWarning(true); // 비즈니스 종류가 선택되지 않으면 경고 표시
            return;
        }

        if (!businessType || !businessName || !address) {
            setErrorMessage('필수 항목들을 기입해주시길 바랍니다.');
            setShowErrorMessageModal(true);
            return;
        }

        let dobFormatted = dob;
        if (dob.length === 6) {
            const yearPrefix = parseInt(dob.substring(0, 2)) > 24 ? '19' : '20';
            dobFormatted = `${yearPrefix}${dob.substring(0, 2)}-${dob.substring(2, 4)}-${dob.substring(4, 6)}`;
        } else {
            setErrorMessage('생년 월일을 YYMMDD 형태로 입력해 주세요.');
            setShowErrorMessageModal(true);
            return;
        }

        const marketingValue = marketingAccepted ? 'Y' : 'N';

        try {
            const response = await fetch(`${config.apiDomain}/api/signup/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username, password, name, dob: dobFormatted,
                    phone, email: email || null,
                    store_category: businessType,
                    store_name: businessName,
                    store_address: address,
                    marketing: marketingValue,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setShowWelcomeModal(true);
            } else {
                setErrorMessage(data.message || '회원가입에 실패했습니다.');
                setShowErrorMessageModal(true);
            }
        } catch (error) {
            setErrorMessage('회원가입 요청 중 오류가 발생했습니다.');
            setShowErrorMessageModal(true);
        }
    };

    const handleErrorMessageModalClose = () => {
        setShowErrorMessageModal(false);
        setErrorMessage('');
    };

    const handleWelcomeModalClose = () => {
        setShowWelcomeModal(false);
        router.push('/login');
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-violet-50">
            <div className="bg-white px-10 py-8 rounded-md shadow-lg max-w-md w-full space-y-3">
                <div className="flex items-center mb-12">
                    <ChevronLeft
                        className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
                        onClick={() => router.back()}
                    />
                    <h1 className="text-3xl font-bold text-center text-indigo-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>회원가입</h1>
                </div>

                {/* 드롭다운 */}
                <div className="mb-4">
                    <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className={`w-full border rounded-md p-2 ${showWarning ? 'border-red-500' : ''}`}
                    >
                        <option value="">비즈니스 종류를 선택해주세요</option>
                        <option value="FOOD">음식점</option>
                        <option value="RETAIL">판매점</option>
                        <option value="UNMANNED">무인매장</option>
                        <option value="PUBLIC">공공기관</option>
                        <option value="OTHER">기타</option>
                    </select>

                    {showWarning && (
                        <p className="text-red-500 text-sm mt-1">비즈니스 종류를 선택해주세요.</p>
                    )}
                </div>

                <div>
                    <label className="flex text-gray-700 mb-3">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                name="businessName"
                                placeholder="매장명"
                                value={formData.businessName}
                                onChange={handleInputChange}
                                className="border px-4 py-2 border-gray-300 rounded-md  w-full"
                            />
                            <label className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">*</label>
                        </div>
                    </label>
                </div>

                <div>
                    <label className="flex text-gray-700 w-full">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                name="address"
                                placeholder="주소"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="border px-4 py-2 border-gray-300 rounded-md w-full"
                            />
                            <label className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">*</label>
                        </div>
                    </label>
                </div>

                <div className="flex items-center justify-center space-x-2 mt-4">
                    <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={handleTermsCheckboxChange}
                        className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <label
                        className="text-sm font-medium underline hover:text-blue-600 cursor-pointer"
                        onClick={handleTermsCheckboxChange}
                    >
                        이용약관 및 개인정보 수집 동의(필수)
                    </label>
                </div>

                <div className="flex items-center justify-center space-x-2">
                    <input
                        type="checkbox"
                        checked={marketingAccepted}
                        onChange={() => setMarketingAccepted(!marketingAccepted)}
                        className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <label className="text-sm font-medium underline hover:text-blue-600" onClick={() => setShowMarketingModal(true)}>
                        마케팅 활용 동의 및 광고 수신 동의(선택)
                    </label>
                </div>
                <button
                    className="bg-indigo-500 text-white py-2 px-4 rounded-md w-full mt-3 font-medium"
                    onClick={handleSignup}
                >
                    회원가입
                </button>

                {/* 이용약관 보여주는 모달 */}
                <TermsOfServiceModal
                    show={showTermsModal}
                    onClose={() => setShowTermsModal(false)}
                    onAgree={(isAgreed) => setTermsAccepted(isAgreed)}
                />

                {/* 광고 및 마케팅 약관 보여주는 모달 */}
                <MarketingModal
                    show={showMarketingModal}
                    onClose={() => setShowMarketingModal(false)}
                    onAgree={(isAgreed) => setMarketingAccepted(isAgreed)}
                />

                {/* 에러메시지 모달 */}
                <ModalErrorMSG show={showErrorMessageModal} onClose={handleErrorMessageModalClose}>
                    <p className='whitespace-pre-line'>
                        {typeof errorMessage === 'object' ? (
                            Object.entries(errorMessage).map(([key, value]) => (
                                <span key={key}>
                                    {key}: {Array.isArray(value) ? value.join(', ') : value.toString()}<br />
                                </span>
                            ))
                        ) : (
                            errorMessage
                        )}
                    </p>
                </ModalErrorMSG>

                {/* 회원가입 성공 및 환영 모달 */}
                <ModalMSG show={showWelcomeModal} onClose={handleWelcomeModalClose} title="Welcome">
                    <p className=''>{username}님 환영합니다!</p>
                </ModalMSG>

            </div >
        </div>
    );
};

export default SignupStep2;
