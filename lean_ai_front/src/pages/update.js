import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ModalMSG from '../components/modal/modalMSG';

export default function ErrorPage() {
    const [showWModal, setShowModal] = useState(true);
    const router = useRouter();

    const handleModalClose = () => {
        setShowModal(false);
        router.push('/');
    };

    return (
        <div>
        <ModalMSG show={showWModal} onClose={handleModalClose} title="메시지">
            <p className=''> 추후 추가 될 예정입니다.</p>
        </ModalMSG>
        </div>

    )
}