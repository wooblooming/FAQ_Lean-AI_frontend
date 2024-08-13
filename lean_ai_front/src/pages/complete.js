// pages/complete.js

/* 백엔드 연동시 이용 
import { useEffect } from 'react';
export async function getServerSideProps(context) {
    const { token_version_id, enc_data, integrity_value } = context.query;

    // 서버에 토큰 데이터를 보내서 결과를 받아옵니다.
    const response = await fetch(`https://your-backend-api/nice-auth-result`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token_version_id, enc_data, integrity_value }),
    });

    const authResult = await response.json();

    return {
        props: { authResult },
    };
}


export default function CompletePage({ authResult }) {
    useEffect(() => {
        const pathname = opener?.location?.pathname;

        const queryString = `?isAuth=${authResult.isSuccess ? '1' : '0'}${
            authResult.systemMessage ? `&msg=${authResult.systemMessage}` : ''
        }`;

        if (window.opener) {
            window.opener.location.href = `${pathname}${queryString}`;
        }

        window.close();
    }, [authResult]);

    return <div>인증이 완료되었습니다. 창이 자동으로 닫힙니다...</div>;
}
*/

import { useRouter } from 'next/router';

const CompletePage = () => {
    const router = useRouter();
    const { phone, error } = router.query;

    if (error) {
        return <div>인증에 실패했습니다.</div>;
    }

    return (
        <div>
            <h2>인증이 완료되었습니다!</h2>
            <p>인증된 핸드폰 번호: {phone}</p>
        </div>
    );
};

export default CompletePage;
