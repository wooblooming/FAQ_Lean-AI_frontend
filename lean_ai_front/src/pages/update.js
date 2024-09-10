import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ModalMSG from '../components/modalMSG';

export default function ErrorPage() {
    const [showWModal, setShowModal] = useState(true);
    const router = useRouter();

    const handleModalClose = () => {
        setShowModal(false);
        router.push('/');
    };

    return (
        <>
        <ModalMSG show={showWModal} onClose={handleModalClose} title="메시지">
            <p className=''> 추후 추가 될 예정입니다.</p>
        </ModalMSG>
        </>

    )
}