import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft } from 'lucide-react';
import config from '../../config';

const ComplaintLookup = () => {
    const router = useRouter();
    
    return (
        <div className="min-h-screen py-12 px-4 font-sans bg-violet-50">
            <div className="flex flex-col space-y-6 max-w-4xl mx-auto py-12 px-6 shadow-md rounded-lg" style={{ backgroundColor: '#fff', borderRadius: '50px 0 50px 0' }}>
                <div className="flex items-center">
                    <ChevronLeft
                        className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
                        onClick={() => router.back()} // 뒤로가기 버튼
                    />
                    <h1 className="text-3xl font-bold text-center text-indigo-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>민원 조회</h1>
                </div>
            </div>
        </div>
    )
}
export default ComplaintLookup;