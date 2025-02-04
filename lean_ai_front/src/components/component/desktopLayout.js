import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from "next/image";
import { motion } from 'framer-motion';
import { usePublic } from '../../contexts/publicContext';
import { useAuth } from '../../contexts/authContext';

const DesktopLayout = () => {
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
                router.push('/mainPage');
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

    // 애니메이션 설정
    const fadeInUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    };

    return (
        <div>
            <div className="flex justify-center items-center">
                {/* 텍스트 섹션 - PC */}
                <motion.div className="z-20 " variants={fadeInUp} transition={{ duration: 0.8 }}>
                    <div name="text" className="flex flex-col">
                        <div className="flex flex-col text-center text-gray-800 whitespace-nowrap text-4xl font-semibold mb-8">
                            <p className="mb-3 ">무엇이든 물어보세요</p>
                            <p className="text-5xl font-bold text-indigo-600 mb-8 ">QR코드로</p>
                            <p className="mb-3 ">무엇이든 답해드려요</p>
                            <p className="text-5xl font-bold text-indigo-600">AI챗봇으로</p>
                        </div>

                        <div className="flex flex-row space-x-4 z-20">
                            {/* 무물 이용하기 버튼 */}
                            <motion.button
                                className="text-white px-6 py-4 mb-2 my-4 rounded-full text-2xl transition-colors whitespace-nowrap"
                                style={{ backgroundColor: '#FF609E', fontFamily: 'NanumSquareExtraBold' }}
                                onClick={handleClick}
                            >
                                무물 이용하기
                            </motion.button>
                            {/* 도입 신청하기 버튼 */}
                            <motion.button
                                className="bg-cyan-500 text-white px-6 py-4 mb-2 my-4 rounded-full text-2xl transition-colors whitespace-nowrap"
                                style={{ fontFamily: 'NanumSquareExtraBold' }}
                                onClick={() =>
                                    router.push('https://docs.google.com/forms/d/e/1FAIpQLSfrPgaIfdHYLW6CO9cSbr4s-JqtWy2zkyAb1XEjqXClFITTIw/viewform')
                                }
                            >
                                도입 신청하기
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* 이미지 섹션 - PC */}
                <div className=" md:block z-10 w-full" style={{ height: "650px" }}>
                    <CacheBustedImage
                        src='/images/index_desktop.png'
                        alt='mumul'
                        layout="fill"
                        style={{ objectFit: "contain" }}
                        className="rounded-lg"
                        version="v2"
                        priority
                    />
                </div>
            </div>
        </div>
    )
}

export default DesktopLayout;