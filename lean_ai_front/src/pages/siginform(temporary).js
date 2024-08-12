import React from 'react';
import Link from 'next/link'; // Next.js의 Link 컴포넌트를 사용하여 클라이언트 사이드 네비게이션 처리

function signup() {

    return (
        <div className= "min-h-screen flex items-center justify-center bg-blue-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">LEAN AI</h1>
                <form className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="아이디"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="비밀번호"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            placeholder="이름"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="생년월일"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="휴대폰 번호"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="button" class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-lg">
                            인증하기
                        </button>
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="이메일"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="업소명"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="주소"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input type="checkbox" class="mr-2" required />
                            <label className="text-sm">이용약관 및 개인정보 수집 동의(필수)</label>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" class="mr-2" />
                            <label className="text-sm">마케팅 활용 동의 및 광고 수신 동의(선택)</label>
                        </div>
                    </div>
                    <button id="signupBtn" class="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg mt-4">
                        회원가입
                    </button>

                    { /* 모달창 */}
                    <div id="myModal" className="fixed inset-0 hidden flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <h2 className="text-lg font-bold mb-4">성공하셨습니다!</h2>
                            <p>확인 버튼을 누르면 로그인 페이지로 이동합니다.</p>
                            <button id="confirmBtn" className="bg-blue-500 text-white py-2 px-4 rounded mt-4">확인</button>
                        </div>
                    </div>
                </form>
                <div className="text-center mt-4">
                    <p className="text-sm"> 이미 계정이 있나요?
                        <Link href="/login" className="text-gray-400">로그인</Link>
                    </p>
                    <p className="text-sm"> 계정을 잊어버리셨나요?
                        <   Link href="/findingId" className="text-gray-400">계정찾기</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default signup;
