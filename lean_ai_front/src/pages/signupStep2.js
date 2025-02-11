import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft } from 'lucide-react';
import TermsOfServiceModal from '../components/modal/termsOfServiceModal';
import MarketingModal from '../components/modal/marketingModal';
import ModalMSG from '../components/modal/modalMSG';
import ModalErrorMSG from '../components/modal/modalErrorMSG';
 
const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

const SignupStep2 = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '', password: '', name: '', dob: '', phone: '', email: '',
        businessType: '', businessName: '', address: ''
    });
    const [termsAccepted, setTermsAccepted] = useState(false); // 약관 동의 상태
    const [marketingAccepted, setMarketingAccepted] = useState(false); // 마케팅 동의 상태
    const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 저장
    const [showWarning, setShowWarning] = useState(false); // 비즈니스 종류 미선택 경고
    const [showTermsModal, setShowTermsModal] = useState(false); // 이용약관 모달 상태
    const [showMarketingModal, setShowMarketingModal] = useState(false); // 마케팅 약관 모달 상태
    const [showWelcomeModal, setShowWelcomeModal] = useState(false); // 환영 모달 상태
    const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 상태

    useEffect(() => {
        // sessionStorage에서 사용자 정보를 불러오기
        const storedUserData = sessionStorage.getItem('signupUserData');
        if (storedUserData) {
            setFormData(JSON.parse(storedUserData));
        } else {
            // 만약 데이터가 없으면 첫 단계로 리다이렉트
            router.push('/signupStep1');
        }
    }, []);

    // 입력 필드 변경 처리 함수
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'businessType' && value !== '') setShowWarning(false);
    };

    // 회원가입 처리 함수
    const handleSignup = async () => {
        const { username, password, name, dob, phone, email, businessType, businessName, address } = formData;

        if (!businessType || !businessName || !address) {
            setErrorMessage('필수 항목들을 기입해주시길 바랍니다.');
            setShowErrorMessageModal(true);
            return;
        }
        
        // 약관 동의 확인
        if (!termsAccepted) {
            setErrorMessage('이용약관 및 개인정보 수집 동의는 필수입니다.');
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
            const response = await fetch(`${API_DOMAIN}/api/signup/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username, password, name, dob: dobFormatted, phone, email: email || null,
                    store_category: businessType, store_name: businessName, store_address: address, marketing: marketingValue,
                }),
            });

            const data = await response.json();
            if (data.success) setShowWelcomeModal(true);
            else {
                setErrorMessage(data.message || '회원가입에 실패했습니다.');
                setShowErrorMessageModal(true);
            }
        } catch (error) {
            setErrorMessage('회원가입 요청 중 오류가 발생했습니다.');
            setShowErrorMessageModal(true);
        }
    };

    // 약관 동의 상태 변경
    const handleTermsCheckboxChange = () => {
        if (!termsAccepted) {
            setShowTermsModal(true);
        } else {
            setTermsAccepted(!termsAccepted);
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
        <div className="min-h-screen flex flex-col justify-center items-center bg-violet-50 px-2 md:px-0">
            <div className="bg-white px-3 py-6 rounded-md shadow-lg max-w-md w-full space-y-3 ">
                <div className='flex flex-col gap-1'>
                    <div className="flex items-center">
                        <ChevronLeft
                            className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
                            onClick={() => router.back()} // 뒤로가기 버튼
                        />
                        <h1 className="text-3xl font-bold text-left text-indigo-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>회원가입</h1>
                    </div>
                    <div className="text-l text-left text-gray-600 px-5" style={{ fontFamily: 'NanumSquareBold' }}>사업장 정보를 입력해주세요</div>
                </div>

                <div className='px-5 space-y-3'>
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
                    <div className="flex items-center justify-center space-x-2">
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
                        className="w-full bg-indigo-500 text-white py-2 rounded-lg text-lg font-semibold"
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
                        <p className=''>{formData.username}님 환영합니다!</p>
                    </ModalMSG>
                </div>
            </div>
        </div>
    );
};

export default SignupStep2;
