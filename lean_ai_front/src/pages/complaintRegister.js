import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';
import { fetchPublicDepartment } from '../fetch/fetchPublicDepart';
import PersonalInfoModal from '../components/modal/personalInfoModal';
import ModalMSG from '../components/modal/modalMSG';
import ModalErrorMSG from '../components/modal/modalErrorMSG';
import config from '../../config';

const RegisterComplaint = () => {
    const router = useRouter();
    const { slug } = router.query; // URL에서 slug 파라미터 가져옴
    const [termsAccepted, setTermsAccepted] = useState(false); // 약관 동의 상태
    const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false); // 개인정보 약관 모달 상태
    const [message, setMessage] = useState(''); // 일반 메시지 내용
    const [showMessageModal, setShowMessageModal] = useState(false); // 일반 메시지 모달의 열림/닫힘 상태
    const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 저장
    const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 상태
    const [departments, setDepartments] = useState([]); // 초기값을 빈 배열로 설정
    const [selectedDepartment, setSelectedDepartment] = useState('');

    // 입력 필드 상태
    const [name, setName] = useState('');
    const [birth_date, setBirthDate] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // 카테고리 목록을 백엔드에서 가져오기
    useEffect(() => {
        if (slug) {
            fetchPublicDepartment({slug}, null, setDepartments);
        }
    }, [slug]);

    // 개인정보 동의 모달 열기
    const handlePersonalInfoCheckboxChange = () => setShowPersonalInfoModal(true);

    // 일반 메시지 모달 닫기 & 초기화
    const handleMessageModalClose = () => {
        setShowMessageModal(false);
        setMessage('');
        const encodedSlug = encodeURIComponent(slug);
        router.push(`/publicIntroduction/${encodedSlug}`);
    };

    // 에러 메시지 모달 닫기 & 초기화
    const handleErrorMessageModalClose = () => {
        setShowErrorMessageModal(false);
        setErrorMessage('');
    };

    // 접수하기 버튼 클릭 시 호출되는 함수
    const handleSubmit = async () => {

        // 입력 필드 유효성 검사
        if (!name || !birth_date || !phone || !email || !title || !content) {
            setErrorMessage('모든 필드를 입력해 주세요.');
            setShowErrorMessageModal(true);
            return;
        }

        if (!termsAccepted) {
            setErrorMessage('개인 정보 수집을 동의 해주세요.');
            setShowErrorMessageModal(true);
            return;
        }

        if (!selectedDepartment) {
            setErrorMessage('민원을 접수할 부서를 선택해 주세요.');
            setShowErrorMessageModal(true);
            return;
        }

        try {
            // 백엔드로 전송할 데이터
            const requestData = {
                name,
                birth_date,
                phone,
                email,
                title,
                department: selectedDepartment,
                content,
                slug
            };

            //console.log("requestData : ", requestData);

            // POST 요청으로 백엔드에 데이터 전송
            const response = await axios.post(`${config.apiDomain}/public/complaints/register/`, requestData);
            //console.log("response : ", response);

            if (response.data.status === 'success') {
                setMessage(response.data.message);
                setShowMessageModal(true);
            } else {
                setErrorMessage('접수에 실패했습니다.');  // 백엔드에서 받은 에러 메시지 사용
                setShowErrorMessageModal(true);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(error.response.data.errors || '서버 오류가 발생했습니다.');
            setShowErrorMessageModal(true);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 font-sans bg-violet-50">
            <div className="flex flex-col space-y-6 max-w-4xl mx-auto py-12 px-6 shadow-md rounded-lg" style={{ backgroundColor: '#fff', borderRadius: '50px 0 50px 0' }}>
                <div className="flex items-center">
                    <ChevronLeft
                        className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
                        onClick={() => router.back()} // 뒤로가기 버튼
                    />
                    <h1 className="text-3xl font-bold text-center text-indigo-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>민원 접수</h1>
                </div>

                <div className='flex flex-col space-y-6 items-left px-4'>
                    <div className='flex flex-col' style={{ fontFamily: 'NanumSquare' }}>
                        <h3 className='text-xl font-semibold text-left mb-2' style={{ fontFamily: 'NanumSquareExtraBold' }}>민원인 정보</h3>
                        <div className='grid md:grid-cols-2 gap-x-6 gap-y-4'>
                            <div className='flex flex-col space-y-1'>
                                <p className='text-gray-700' >이름</p>
                                <input
                                    placeholder='이름을 입력해주세요'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="border mx-2 px-4 py-2 border-gray-300 rounded-md w-full"
                                />
                            </div>
                            <div className='flex flex-col space-y-1'>
                                <p className='text-gray-700' >생년월일</p>
                                <input
                                    placeholder='6자리 입력 (ex.241106)'
                                    value={birth_date}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    className="border mx-2 px-4 py-2 border-gray-300 rounded-md w-full"
                                />
                            </div>
                            <div className='flex flex-col space-y-1'>
                                <p className='text-gray-700' >핸드폰번호</p>
                                <input
                                    placeholder='- 없이 입력 핸드폰번호를 입력해주세요'
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="border mx-2 px-4 py-2 border-gray-300 rounded-md w-full"
                                />
                            </div>
                            <div className='flex flex-col space-y-1'>
                                <p className='text-gray-700'>이메일</p>
                                <input
                                    placeholder='이메일 주소'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border mx-2 px-4 py-2 border-gray-300 rounded-md w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col'>
                        <h3 className='text-xl font-semibold text-left mb-2' >접수 내용</h3>
                        <div className='flex flex-col space-y-3'>
                            <div className='grid md:grid-cols-2 gap-3 md:gap-6' >
                                <div className='flex flex-col space-y-1'>
                                    <p className='text-gray-700' >민원 제목</p>
                                    <input
                                        placeholder='민원제목입력'
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="border mx-2 px-4 py-2 border-gray-300 rounded-md w-full"
                                    />
                                </div>
                                <div className='flex flex-col space-y-1'>
                                    <p className='text-gray-700'>민원 카테고리</p>
                                    <select
                                        value={selectedDepartment}
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                        className="border mx-2 px-4 py-2 border-gray-300 rounded-md w-full"
                                    >
                                        <option value="">카테고리를 선택하세요</option>
                                        {departments.map((department, index) => (
                                            <option key={index} value={department}>
                                                {department}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <div className='flex flex-col space-y-1'>
                                    <p className='text-gray-700' > 민원 내용</p>
                                    <textarea
                                        placeholder='민원내용입력'
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="border mx-2 px-4 py-2 border-gray-300 rounded-md w-full h-28"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col'>
                        <h3 className='text-xl font-semibold text-left mb-2' style={{ fontFamily: 'NanumSquareExtraBold' }}>약관 동의</h3>
                        <div className='flex flex-row space-x-2 p-3 border border-gray-300 rounded-md items-center'>
                            <input
                                type="checkbox"
                                checked={termsAccepted}
                                onChange={handlePersonalInfoCheckboxChange}
                                className="form-checkbox h-4 w-4 text-indigo-600"
                            />
                            <label
                                className='hover:underline hover:font-semibold hover:text-indigo-500 text-lg cursor-pointer'
                                style={{ fontFamily: 'NanumSquare' }}
                                onClick={handlePersonalInfoCheckboxChange}
                            >
                                개인정보수집 동의 *
                            </label>
                        </div>
                    </div>

                    <div>
                        <button
                            className='w-full rounded-lg bg-indigo-500 text-white py-3 text-xl font-semibold'
                            style={{ fontFamily: 'NanumSquareExtraBold' }}
                            onClick={handleSubmit}
                        >
                            접수 하기
                        </button>
                    </div>
                </div>
            </div>

            {/* 개인 정보 약관 모달 */}
            <PersonalInfoModal
                show={showPersonalInfoModal}
                onClose={() => setShowPersonalInfoModal(false)}
                onAgree={(isAgreed) => setTermsAccepted(isAgreed)}
            />

            {/* 성공 메시지 모달 */}
            <ModalMSG
                show={showMessageModal}
                onClose={handleMessageModalClose}
                title="Success"
            >
                <p style={{ whiteSpace: 'pre-line' }}>
                    {message}
                </p>
            </ModalMSG>

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
        </div>
    );
};

export default RegisterComplaint;
