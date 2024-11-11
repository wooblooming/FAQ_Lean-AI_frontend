import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, Store, Building2 } from 'lucide-react';
const SignupType = ({ }) => {
    const router = useRouter(); // 페이지 이동 및 뒤로 가기 기능을 위한 라우터

    return (
        <div className="min-h-screen flex justify-center items-center py-12 px-4 bg-violet-50" >
            <div className="max-w-4xl mx-auto w-full p-6 shadow-md rounded-lg bg-white flex flex-col gap-6" >
                <div className='flex flex-col space-y-2'>
                    <div className="flex items-center">
                        <ChevronLeft
                            className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
                            onClick={() => router.back()} // 뒤로가기 버튼
                        />
                        <h1 className="text-3xl font-bold text-left  text-indigo-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>회원가입</h1>
                    </div>
                    <div className="text-xl font-bold text-left text-gray-600 px-5" style={{ fontFamily: 'NanumSquareBold' }}>회원 유형을 선택해주세요</div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 justify-center items-center'>

                    <div className="flex flex-col items-center justify-center space-y-2 border border-gray-200 p-4 rounded-lg">
                        <div className="h-28 w-28 flex items-center justify-center rounded-full bg-indigo-400 ">
                            <Store className="text-white h-20 w-20" />
                        </div>
                        <p className='text-gray-600 text-lg flex text-center items-center whitespace-pre-line h-20' style={{ fontFamily: 'NanumSquareBold' }}> 
                            음식점이나 판매점을 <br/>
                            운영 중이시라면?
                        </p>
                        <button 
                            className='text-lg px-3 py-2 rounded-md bg-indigo-400 text-white'
                            style={{ fontFamily: 'NanumSquareBold' }} 
                            onClick={()=> router.push('/signupStep1')}
                        >
                            가입하기
                        </button>
                    </div>

                    <div   
                        className="flex flex-col items-center justify-center space-y-2 border border-gray-200 p-4 rounded-lg"
                        onClick={()=> router.push('/signupPublicStep1')}
                    >
                        <div className="h-28 w-28 flex items-center justify-center rounded-full bg-indigo-400 ">
                            <Building2 className="text-white h-20 w-20" />
                        </div>
                        <p className='text-gray-600 text-lg flex text-center items-center whitespace-pre-line h-20' style={{ fontFamily: 'NanumSquareBold' }}>
                            공공기관에서 <br/>
                            업무 중이시라면?
                        </p>
                        <button 
                            className='text-lg px-3 py-2 rounded-md bg-indigo-400 text-white'
                            style={{ fontFamily: 'NanumSquareBold' }} 
                            onClick={()=> router.push('/signupPublicStep1')}
                        >
                            가입하기
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default SignupType;