// pages/auth.js


/* 백엔드 연동시 이용
import { useEffect } from 'react';

export async function getServerSideProps(context) {
    const { userId } = context.query;
    const returnUrl = `http://172.16.20.25:3000/auth/complete`;

    // 서버에 요청하여 인증에 필요한 데이터를 받아옵니다.
    const response = await fetch(`https://your-backend-api/nice-auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, returnUrl }),
    });

    const authData = await response.json();

    return {
        props: { authData },
    };
}

export default function AuthPage({ authData }) {
    useEffect(() => {
        const form = document.getElementById('authForm');
        if (form) {
            form.submit();
        }
    }, []);

    return (
        <div>
            <form
                id="authForm"
                method="post"
                action="https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb"
            >
                <input type="hidden" name="m" value="service" />
                <input type="hidden" name="token_version_id" value={authData.tokenVersionId} />
                <input type="hidden" name="enc_data" value={authData.encData} />
                <input type="hidden" name="integrity_value" value={authData.integrityValue} />
            </form>
        </div>
    );
}
*/

import { useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthPage = () => {
    const router = useRouter();

    useEffect(() => {
        // 모의 인증 절차
        setTimeout(() => {
            const mockAuthResult = {
                success: true, // 인증 성공/실패 플래그
                phone: '010-1234-5678', // 모의 핸드폰 번호
            };

            if (mockAuthResult.success) {
                // 완료 페이지로 이동 (모의 데이터 전달)
                router.push(`/complete?phone=${mockAuthResult.phone}`);
            } else {
                router.push(`/complete?error=auth_failed`);
            }
        }, 2000); // 인증 절차 지연 시뮬레이션 (2초)
    }, [router]);

    return (
        <div>
            <h2>인증 진행 중...</h2>
        </div>
    );
};

export default AuthPage;
