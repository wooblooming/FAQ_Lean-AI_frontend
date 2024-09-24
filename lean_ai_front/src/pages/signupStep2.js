import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import IdCheckModal from '../components/idCheckModal'; // 아이디 중복 검사 기능이 있는 컴포넌트
import VerificationModal from '../components/verificationModal'; // 핸드폰 인증 기능이 있는 컴포넌트
import TermsOfServiceModal from '../components/termsOfServiceModal';
import MarketingModal from '../components/marketingModal';
import ModalMSG from '../components/modalMSG';
import ModalErrorMSG from '../components/modalErrorMSG';
import config from '../../config';

const SignupStep2 = () => {
    const router = useRouter();
    const { username, password, name, dob, phone, email } = router.query;    // 회원 가입 시 백엔드로 전송할 데이터를 관리

    const [formData, setFormData] = useState({
        businessType: '', businessName: '', address: ''
    });

    const [termsAccepted, setTermsAccepted] = useState(false); // 이용 약관 동의 여부 저장
    const [marketingAccepted, setMarketingAccepted] = useState(false); // 광고 및 마케팅 약관 동의 여부 저장
    const [errorMessage, setErrorMessage] = useState(''); // 기타 에러 메시지 저장

    const [showTermsModal, setShowTermsModal] = useState(false); // 이용약관 모달 상태 관리
    const [showMarketingModal, setShowMarketingModal] = useState(false); // 광고 및 마케팅 모달 상태 관리     
    const [showWelcomeModal, setShowWelcomeModal] = useState(false); // 가입 완료 및 환영 모달 상태 관리
    const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 상태 관리


    // 약관 동의 체크박스 클릭 시 이용약관 모달을 띄움
    const handleTermsCheckboxChange = () => {
        setShowTermsModal(true);
    };

    // 입력값에 대해 변화를 감지하여 상태 업데이트 및 추가적인 검증 로직 수행
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // 최종 회원가입 완료
    const handleSignup = async () => {
        const { businessType, businessName, address } = formData;

        // 필수 입력 필드가 모두 입력되었는지 확인
        if (!businessType || !businessName || !address) {
            setErrorMessage('필수 항목들을 기입해주시길 바랍니다');
            setShowErrorMessageModal(true);
            return;
        }

        console.log(dob);
        let dobFormatted = dob;

        if (dob.length === 6) {
            // YYMMDD 형식의 생년월일을 백엔드의 YYYY-MM-DD 형식으로 변환
            const yearPrefix = parseInt(dob.substring(0, 2)) > 24 ? '19' : '20';
            dobFormatted = `${yearPrefix}${dob.substring(0, 2)}-${dob.substring(2, 4)}-${dob.substring(4, 6)}`;
        } else {
            setErrorMessage("생년 월일을 YYMMDD 형태로 입력해 주세요");
            setShowErrorMessageModal(true);
        }

        const marketingValue = marketingAccepted ? 'Y' : 'N';  // 마케팅 동의 여부에 따른 값 설정

        console.log("전송할 데이터:", {
            username,
            password,
            name,
            dob: dobFormatted,
            phone,
            email: email || null,
            store_category: businessType,
            store_name: businessName,
            store_address: address,
            marketing: marketingValue,
        });

        // 입력값 백엔드로 전송
        try {
            const response = await fetch(`${config.apiDomain}/api/signup/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    name,
                    dob: dobFormatted,
                    phone,
                    email: email || null,  // 이메일이 없을 경우 null로 보냄
                    store_category: businessType,
                    store_name: businessName,
                    store_address: address,
                    marketing: marketingValue,  // 마케팅 필드 추가
                }),
            });

            const data = await response.json();
            // 디버깅용: 서버로부터 받은 데이터를 출력
             console.log(data);

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

    // 에러 메시지 모달을 닫음
    const handleErrorMessageModalClose = () => {
        setShowErrorMessageModal(false);
        setErrorMessage('');
    };

    // 회원가입 성공 후 환영 모달을 닫고 로그인 페이지로 이동
    const handleWelcomeModalClose = () => {
        setShowWelcomeModal(false);
        router.push('/login');
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-indigo-100">
            <div className="bg-white p-8 rounded-md shadow-lg max-w-md w-full">
                {/* 상단 뒤로 가기 화살표와 회원가입 텍스트 */}
                <div className="flex items-center mb-6">
                    <Link href="/signupStep1" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
                        <ArrowLeft className="mr-2 text-2xl" /> {/* 화살표 아이콘 크기 조정 */}
                        <span className="text-xl font-bold text-purple-600">회원가입</span>
                    </Link>
                </div>
                {/* 환영 메시지 */}
                <h1 className="text-2xl font-bold mb-4 text-gray-800">어떤 비즈니스를 운영하고 계신가요?</h1>
                <p className="mb-4 text-gray-600">비즈니스의 정보를 입력하면 Mumul의 서비스를 < br /> 여러분의 필요에 맞게 최적화할 수 있습니다</p>

                {/* 사업장 선택 드롭박스 */}
                <div className="mb-4">
                    <div className="flex items-center">
                        <label className="text-red-500">*</label>
                        <span className="ml-1 text-gray-700 mb-2">비즈니스 종류를 선택해주세요</span>
                    </div>
                    <select name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="w-full border rounded-md px-3 py-2"
                    >
                        <option value="">비즈니스 종류 선택</option>
                        <option value="FOOD">음식점</option>
                        <option value="RETAIL">판매점</option>
                        <option value="UNMANNED">무인매장</option>
                        <option value="PUBLIC">공공기관</option>
                        <option value="OTHER">기타</option>
                    </select>
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
                    className="bg-gradient-to-r from-purple-400 to-blue-400 text-white py-2 px-4 rounded-md w-full mt-3 font-medium"
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
