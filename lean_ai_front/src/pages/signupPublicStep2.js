import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft } from 'lucide-react';
import TermsOfServiceModal from '../components/termsOfServiceModal';
import RegisterPublic from './registerPublic';
import Modal from '../components/modal';
import MarketingModal from '../components/marketingModal';
import ModalMSG from '../components/modalMSG';
import ModalErrorMSG from '../components/modalErrorMSG';
import axios from 'axios';
import config from '../../config';

const SignupPublicStep2 = () => {
    const router = useRouter();
    const { username, password, name, dob, phone, email } = router.query; // 첫 번째 단계에서 전달된 사용자 정보
    const [termsAccepted, setTermsAccepted] = useState(false); // 약관 동의 상태
    const [marketingAccepted, setMarketingAccepted] = useState(false); // 마케팅 동의 상태
    const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 저장
    const [showTermsModal, setShowTermsModal] = useState(false); // 이용약관 모달 상태
    const [showMarketingModal, setShowMarketingModal] = useState(false); // 마케팅 약관 모달 상태
    const [showWelcomeModal, setShowWelcomeModal] = useState(false); // 환영 모달 상태
    const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 상태
    const [isRegisterPublicModalOpen, setIsRegisterPublicModalOpen] = useState(false); // 기관 데이터 입력 모달 상태

    const [publicInstitutions, setPublicInstitutions] = useState([]); // 기관 목록
    const [selectedInstitutionId, setSelectedInstitutionId] = useState(null); // 선택된 기관 ID
    const [selectedInstitution, setSelectedInstitution] = useState(null); // 선택된 기관 정보

    // 기관 목록을 가져오는 함수
    useEffect(() => {
        const fetchPublicInstitutions = async () => {
            try {
                const response = await axios.get(`${config.apiDomain}/public/public-institutions/`);
                setPublicInstitutions(response.data);
                
            } catch (error) {
                console.error("Error fetching institutions:", error);
                setErrorMessage('기관 정보를 불러오는 중 오류가 발생했습니다.');
                setShowErrorMessageModal(true);
            }
        };

        fetchPublicInstitutions();
    }, []);

    useEffect(() => {
        console.log("Updated publicInstitutions:", publicInstitutions);
    }, [publicInstitutions]);

    useEffect(() => {
        console.log("Updated selectedInstitution:", selectedInstitution);
    }, [selectedInstitution]);

    // 선택된 기관의 상세 정보를 가져오는 함수
    const fetchInstitutionDetails = async (institutionId) => {
        console.log("institutionId : ",institutionId );
        try {
            const response = await axios.post(`${config.apiDomain}/public/public-details/`, {
                id: institutionId 
            });
            setSelectedInstitution(response.data); // 선택된 기관의 상세 정보를 상태에 저장
        } catch (error) {
            console.error("Error fetching institution details:", error);
            setErrorMessage('기관 상세 정보를 불러오는 중 오류가 발생했습니다.');
            setShowErrorMessageModal(true);
        }
    };

    // 드롭다운에서 기관 선택 시 호출되는 함수
    const handleInstitutionSelect = (e) => {
        const institutionId = e.target.value;
        setSelectedInstitutionId(institutionId);
        if (institutionId) {
            fetchInstitutionDetails(institutionId); // 선택된 기관의 상세 정보 호출
        } else {
            setSelectedInstitution(null); // 기관 선택 초기화
        }
    };

    // 회원가입 처리 함수
    const handleSignup = async () => {

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
            const response = await axios.post(`${config.apiDomain}/public/signup/`, {
                username,
                password,
                name,
                dob : dobFormatted,
                phone,
                email: email || null,
                institution_id: selectedInstitutionId,
                marketing: marketingValue,
            });

            if (response.data.success) {
                setShowWelcomeModal(true); // 성공 시 환영 모달 표시
            } else {
                setErrorMessage(response.data.message || '회원가입에 실패했습니다.');
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
        <div className="min-h-screen flex flex-col justify-center items-center bg-violet-50 px-2 md:px-0">
            <div className="bg-white px-3 py-6 rounded-md shadow-lg max-w-md w-full space-y-4 ">
                <div className='flex flex-col gap-1'>
                    <div className="flex items-center">
                        <ChevronLeft
                            className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
                            onClick={() => router.back()} // 뒤로가기 버튼
                        />
                        <h1 className="text-3xl font-bold text-left text-indigo-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>회원가입</h1>
                    </div>
                    <div className="text-l text-left text-gray-600 px-5" style={{ fontFamily: 'NanumSquareBold' }}>기관 정보를 선택해주세요</div>
                </div>

                <div className='px-5 space-y-5'>
                    {/* 기관 선택 - 드롭다운 */}
                    <div className="space-y-2">
                        <select
                            name="institution"
                            value={selectedInstitutionId || ''}
                            onChange={handleInstitutionSelect}
                            className="w-full border rounded-md p-2"
                        >
                            <option value="">기관을 선택해주세요</option>
                            {publicInstitutions.map((institution) => (
                                <option key={institution.public_id} value={institution.public_id}>
                                    {institution.public_name}
                                </option>
                            ))}
                        </select>


                        <div className='flex flex-row gap-5 items-center px-3'>
                            <p className='text-sm text-gray-600'>
                                <span className='text-red-500 mr-1'>*</span>기관 정보가 없다면 기관을 등록해주세요!
                            </p>
                            <button
                                className='text-sm text-indigo-500 hover:underline'
                                style={{ fontFamily: 'NanumSquareBold' }}
                                onClick={() => setIsRegisterPublicModalOpen(true)}
                            >
                                기관 정보 등록
                            </button>
                        </div>
                    </div>

                    {/* 선택된 기관 정보 출력 */}
                    <div name='storedData' className='space-y-2 text-gray-600'>
                        <div className='border-b border-gray-400 p-2'>
                            기관명:  <span className='text-black font-semibold ml-1'> {selectedInstitution ? selectedInstitution.public_name : '선택된 기관명'} </span>
                        </div>
                        <div className='border-b border-gray-400 p-2'>
                            운영 시간: <span className='text-black font-semibold ml-1'>{selectedInstitution ? selectedInstitution.opening_hours : '선택된 기관의 운영 시간'} </span>
                        </div>
                        <div className='border-b border-gray-400 p-2'>
                            대표 전화번호: <span className='text-black font-semibold ml-1'> {selectedInstitution ? selectedInstitution.public_tel : '선택된 기관의 대표 전화번호'}</span>
                        </div>
                        <div className='border-b border-gray-400 p-2'>
                            주소: <span className='text-black font-semibold ml-1'> {selectedInstitution ? selectedInstitution.public_address : '선택된 기관의 주소'}</span>
                        </div>
                    </div>

                    {/* 약관 및 마케팅 동의 체크박스 */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                            <input
                                type="checkbox"
                                checked={termsAccepted}
                                onChange={() => setShowTermsModal(true)}
                                className="form-checkbox h-4 w-4 text-blue-600"
                            />
                            <label
                                className="text-sm font-medium underline hover:text-blue-600 cursor-pointer"
                                onClick={() => setShowTermsModal(true)}
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
                    </div>

                    {/* 기관 정보 등록 모달 */}
                    {isRegisterPublicModalOpen && (
                        <Modal onClose={() => setIsRegisterPublicModalOpen(false)}>
                            <RegisterPublic />
                        </Modal>
                    )}

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
                        <p className='whitespace-pre-line'>{errorMessage}</p>
                    </ModalErrorMSG>

                    {/* 회원가입 성공 모달 */}
                    <ModalMSG show={showWelcomeModal} onClose={handleWelcomeModalClose} title="Welcome">
                        <p className=''>{username}님 환영합니다!</p>
                    </ModalMSG>
                </div>
            </div>
        </div>
    );
};

export default SignupPublicStep2;
