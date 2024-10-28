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
    const { username, password, name, dob, phone, email } = router.query; // 첫 번째 단계에서 전달된 사용자 정보

    const [formData, setFormData] = useState({
        businessType: '', businessName: '', address: ''
    }); // 사업자 정보 저장 상태
    const [termsAccepted, setTermsAccepted] = useState(false); // 약관 동의 상태
    const [marketingAccepted, setMarketingAccepted] = useState(false); // 마케팅 동의 상태
    const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 저장
    const [showWarning, setShowWarning] = useState(false); // 비즈니스 종류 미선택 경고
    const [showTermsModal, setShowTermsModal] = useState(false); // 이용약관 모달 상태
    const [showMarketingModal, setShowMarketingModal] = useState(false); // 마케팅 약관 모달 상태
    const [showWelcomeModal, setShowWelcomeModal] = useState(false); // 환영 모달 상태
    const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 상태

    // 입력 필드 변경 처리 함수
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value }); // 입력된 값을 상태에 업데이트
        if (name === 'businessType' && value !== '') setShowWarning(false); // 비즈니스 종류 선택 시 경고 메시지 숨김
    };

    // 약관 동의 모달 열기
    const handleTermsCheckboxChange = () => setShowTermsModal(true);

    // 회원가입 처리 함수
    const handleSignup = async () => {
        const { businessType, businessName, address } = formData;

        if (!businessType) {
            setShowWarning(true); // 비즈니스 종류 미선택 시 경고 메시지 표시
            return;
        }

        if (!businessType || !businessName || !address) { // 필수 항목 미기입 시 에러 메시지 표시
            setErrorMessage('필수 항목들을 기입해주시길 바랍니다.');
            setShowErrorMessageModal(true);
            return;
        }

        // 생년월일 형식 변환
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
                    username, password, name, dob: dobFormatted, phone, email: email || null,
                    store_category: businessType, store_name: businessName, store_address: address, marketing: marketingValue,
                }),
            });

            const data = await response.json();
            if (data.success) setShowWelcomeModal(true); // 성공 시 환영 모달 표시
            else {
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
        router.push('/login'); // 환영 모달 닫기 후 로그인 페이지로 이동
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-violet-50">
            <div className="bg-white px-10 py-8 rounded-md shadow-lg max-w-md w-full space-y-3">
                <div className="flex items-center mb-12">
                    {/* 뒤로 가기 버튼 */}
                    <ChevronLeft
                        className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
                        onClick={() => router.back()}
                    />
                    <div className="flex-grow text-center">
                        <h1 className="text-3xl font-bold text-indigo-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>회원가입</h1>
                    </div>
                </div>

                {/* 비즈니스 종류 선택 - 드롭다운 */}
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

                {/* 사업자명 입력 필드 */}
                <div>
                    <label className="flex text-gray-700 mb-3">
                        <input
                            type="text"
                            name="businessName"
                            placeholder="매장명"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            className="border px-4 py-2 border-gray-300 rounded-md w-full"
                        />
                    </label>
                </div>

                {/* 주소 입력 필드 */}
                <div>
                    <label className="flex text-gray-700 w-full">
                        <input
                            type="text"
                            name="address"
                            placeholder="주소"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="border px-4 py-2 border-gray-300 rounded-md w-full"
                        />
                    </label>
                </div>

                {/* 약관 및 마케팅 동의 체크박스 */}
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

                {/* 회원가입 버튼 */}
                <button
                    className="bg-indigo-500 text-white py-2 px-4 rounded-md w-full mt-3 font-medium"
                    onClick={handleSignup}
                >
                    회원가입
                </button>

                {/* 이용약관 모달 */}
                <TermsOfServiceModal
                    show={showTermsModal}
                    onClose={() => setShowTermsModal(false)}
                    onAgree={(isAgreed) => setTermsAccepted(isAgreed)}
                />

                {/* 마케팅 약관 모달 */}
                <MarketingModal
                    show={showMarketingModal}
                    onClose={() => setShowMarketingModal(false)}
                    onAgree={(isAgreed) => setMarketingAccepted(isAgreed)}
                />

                {/* 에러 메시지 모달 */}
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

                {/* 회원가입 성공 모달 */}
                <ModalMSG show={showWelcomeModal} onClose={handleWelcomeModalClose} title="Welcome">
                    <p className=''>{username}님 환영합니다!</p>
                </ModalMSG>
            </div>
        </div>
    );
};

export default SignupStep2;
