import React, { useState } from 'react';
import Link from 'next/link'; // Next.js의 Link 컴포넌트를 사용하여 클라이언트 사이드 네비게이션 처리
import { useRouter } from 'next/router';

function signup() {
    // useRouter : 이벤트 있는 페이지 이동시 이용
    const router = useRouter();

    // 회원가입 상태 확인
    const [successSignIn, showErrorMSG] = useState(false);


    // 회원가입 처리
    const goToLogin = () => {

        // 성공 시 로그인 페이지로 이동
        if (successSignIn) 
            router.push('/login');

        // 실패 시 에러 메시지 출력
        else 
            showErrorMSG;
      };

    return (
        <div className="bg-blue-100 flex flex-col items-center min-h-screen overflow-y-auto relative w-full">
            <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center text-center mt-2 mb-4 py-1.5 w-1/3 text-sm font-bold mb-2">
        
                {/* 앱의 타이틀 */}
                <h1 className="text-3xl font-bold text-center mb-8 text-blue-400 mt-12">LEAN AI</h1>

                {/*  입력 필드 및 로그인 옵션들을 감싸는 컨테이너 */}
                <div className="space-y-4">

                    {/*  아이디 입력 필드 -*/}
                    <div>
                        <label className=" flex items-center block text-gray-700 " for="username">
                            <input
                                type="text"
                                placeholder="아이디"
                                className="flex-grow border rounded-l-md px-4 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                            />
                                <button
                                    className="text-white bg-purple-400 rounded-md px-4 py-2 border-l border-purple-400 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 ml-2"
                                >
                                    중복확인
                                </button>
                        </label>
                        <p className="text-red-500 text-sm mt-2">영문 소문자와 숫자만을 사용하여, 영문 소문자로 시작하는 4~12자의 아이디를 입력해주세요.</p>
                    </div>


                    {/*  비밀번호 입력 필드 */}
                    <div>
                        <label className="flex items-center block text-gray-700  border rounded-md px-3 py-2" for="username">
                            <input type="password" placeholder="비밀번호" className="ml-2 w-full border-none focus:ring-0 outline-none"/>
                        </label>
                        <p className="text-red-500 text-sm mt-1">영문 대문자와 소문자, 숫자, 특수문자 중 2가지 이상을 조합하여 8자~20자로 입력해주세요.</p>
                    </div>

                    {/*  비밀번호 확인 입력 필드 */}
                    <div>
                        <label className="flex items-center block text-gray-700 border rounded-md px-3 py-2" for="username">
                            <input type="password" placeholder="비밀번호 확인" className="ml-2 w-full border-none focus:ring-0 outline-none"/>
                        </label>
                    </div>

                    {/*  이름 입력 필드 */}
                    <div class="flex space-x-2 ">
                        <label class="flex-grow border rounded-md px-4 py-2 ">
                            <input type="text" placeholder="이름" className="w-full border-none focus:ring-0 outline-none"/>
                        </label>
                        <label class="flex-grow border rounded-md px-4 py-2 ">
                            <input type="text" placeholder="생년월일(ex.880111)" className="w-full border-none focus:ring-0 outline-none"/>
                        </label>
                    </div>

                    {/*  휴대폰 번호 입력 필드 */}
                    <div class="flex space-x-2 ">
                        <label class="flex-grow border rounded-md px-4 py-2">
                            <input type="text" placeholder="휴대폰 번호" className="w-full border-none focus:ring-0 outline-none"/>
                        </label>
                        <button class="text-white bg-purple-400 rounded-md px-4 py-2">인증번호 받기</button>
                    </div>

                    {/*  인증번호 입력 필드 */}
                    <div className="flex items-center space-x-2">
                        <label className="flex-grow border rounded-md px-4 py-2 mb-4">
                            <input type="text" placeholder="인증번호" className="w-full border-none focus:ring-0 outline-none"/>
                        </label>
                        <p className="text-red-500">03:00</p>
                    </div>

                    {/*  이메일 입력 필드 */}
                    <label className="flex items-center border rounded-md px-4 py-2">
                        <input type="email" placeholder="이메일" className="w-full border-none focus:ring-0 outline-none"/>
                    </label>

                    {/*  업소명 입력 필드 */}
                    <label className="flex items-center border rounded-md px-4 py-2">
                        <input type="text" placeholder="업소명" className="w-full border-none focus:ring-0 outline-none"/>
                    </label>

                    {/*  주소 입력 필드 */}
                    <label className="flex items-center border rounded-md px-4 py-2">
                        <input type="text" placeholder="주소" className="w-full border-none focus:ring-0 outline-none"/>
                    </label>

                    {/*  동의 체크박스 */}
                    <div className="flex items-center space-x-2 mt-4">
                        <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-600"/>
                            <label className="text-sm">이용약관 및 개인정보 수집 동의(필수)</label>
                    </div>
                    <div class="flex items-center space-x-2">
                        <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-600"/>
                            <label className="text-sm">마케팅 활용 동의 및 광고 수신 동의(선택)</label>
                    </div>

                    {/*  회원가입 버튼 */}
                    <button className="bg-gradient-to-r from-purple-400 to-blue-400 text-white font-bold py-2 px-4 rounded-md w-full mt-6" onClick={goToLogin}>회원가입</button>
                </div>

                {/*  하단 링크들 */}
                <div className="mt-6 text-center text-gray-500">
                    <p>이미 계정이 있나요?
                        <Link href="/login" className="underline text-blue-500 p-1 m-1">로그인</Link>
                    </p>
                    <p className="mt-2">
                        계정을 잊어버리셨나요?
                        <Link href="/findingId" className="underline text-blue-500 p-1 m-1">계정찾기</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default signup;
