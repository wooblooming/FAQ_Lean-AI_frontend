import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from "next/image";
import { motion } from 'framer-motion';
import { usePublic } from '../../contexts/publicContext';
import { useAuth } from '../../contexts/authContext';

const MobileLayout = () => {
    const router = useRouter();
    const { token } = useAuth();
    const { isPublicOn } = usePublic();
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 상태

    // 세션 스토리지에서 토큰 확인하여 로그인 상태 설정
    useEffect(() => {
        if (token) {
            setIsLoggedIn(true); // 토큰이 존재하면 로그인 상태로 설정
            //console.log("Token exists:", token);
        } else {
            setIsLoggedIn(false); // 토큰이 없으면 비로그인 상태로 설정
            //console.log("No token found, user is not logged in.");
        }
    }, [token]);


    // 버튼 클릭 시 로그인 상태에 따른 페이지 이동
    const handleClick = () => {
        if (isLoggedIn) { // 로그인 상태에 따라 페이지 이동
            if (isPublicOn) {
                router.push('/mainPageForPublic');
            } else {
                router.push('/mainPageForPresident');
            }
        } else {
            router.push('/login');
        }
    };

    // 캐시 버스팅을 위한 이미지 컴포넌트
    const CacheBustedImage = ({ src, alt, width, height, version, ...props }) => {
        const versionedSrc = `${src}?${version}`;
        return (
            <Image
                src={versionedSrc}
                alt={alt}
                width={width}
                height={height}
                {...props}
            />
        );
    };

    return (
        <div>
            <div className="relative w-full flex flex-col space-y-10 items-center justify-center md:hidden">
                {/* 이미지 섹션 - 모바일 */}
                <div className="w-full h-auto ">
                    <CacheBustedImage
                        src='/index_mobile.png'
                        alt='mumul'
                        layout="responsive"
                        width={500}
                        height={300}
                        version="v2"
                        className="rounded-lg"
                        priority
                    />
                </div>

                {/* 텍스트 섹션 - 모바일 */}
                <div className="w-full p-6 -skew-y-3 bg-white shadow-lg flex flex-col items-center space-y-4">
                    <div className="text-gray-600 text-center whitespace-nowrap text-xl font-semibold">
                        <p>
                            무엇이든 물어보세요
                            <span className="text-2xl font-bold text-indigo-600 ml-2">QR코드로</span>
                        </p>
                        <p>
                            무엇이든 답해드려요
                            <span className="text-2xl font-bold text-indigo-600 ml-2">AI챗봇으로</span>
                        </p>
                    </div>

                    <div className="flex flex-col space-x-2">
                        {/* 무물 이용하기 버튼 */}
                        <motion.button
                            className="text-white px-8 py-3 mb-2 rounded-full text-xl font-semibold transition-colors whitespace-pre-line bg-indigo-600"
                            style={{ backgroundColor: '#FF609E', fontFamily: 'NanumSquareBold' }}
                            onClick={handleClick}
                        >
                            무물 이용하기
                        </motion.button>
                        {/* 도입 신청하기 버튼 */}
                        <motion.button
                            className="text-white px-8 py-3 mb-2 rounded-full text-xl font-semibold transition-colors whitespace-pre-line bg-cyan-500"
                            style={{ fontFamily: 'NanumSquareBold' }}
                            onClick={() =>
                                router.push('https://docs.google.com/forms/d/e/1FAIpQLSfrPgaIfdHYLW6CO9cSbr4s-JqtWy2zkyAb1XEjqXClFITTIw/viewform')
                            }
                        >
                            도입 신청하기
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MobileLayout;