import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ModalMSG from '../components/modal/modalMSG';
import ModalErrorMSG from '../components/modal/modalErrorMSG';
import OpeningHoursSelector from '../components/component/openingHours';
import FileInput from '../components/component/fileInput';
import TextInput from '../components/component/textInput';
import config from '../../config';

export default function RegisterPublic() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        publicName: '',
        publicLocation: '',
        publicTel: '',
        publicLogo: null,
    });

    const [weekdayHours, setWeekdayHours] = useState({ startHour: '09', startMinute: '00', endHour: '18', endMinute: '00' });
    const [weekendHours, setWeekendHours] = useState({ startHour: '09', startMinute: '00', endHour: '13', endMinute: '00' });
    const [isWeekendEnabled, setIsWeekendEnabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState('');

    const handleMessageModalClose = () => {
        setShowMessageModal(false);
        setMessage('');
        router.reload();
    };

    const handleErrorModalClose = () => {
        setShowErrorModal(false);
        setErrorMessage('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (file) => {
        setFormData({ ...formData, publicLogo: file });
    };

    const handleRegisterPublic = async () => {
        try {
            const formattedHours = `평일: ${weekdayHours.startHour}:${weekdayHours.startMinute}-${weekdayHours.endHour}:${weekdayHours.endMinute}, ${isWeekendEnabled ? 
                `주말: ${weekendHours.startHour}:${weekendHours.startMinute}-${weekendHours.endHour}:${weekendHours.endMinute}` : '주말: 휴무'}`;

            if (!formData.publicName || !formattedHours || !formData.publicLocation || !formData.publicTel) {
                setErrorMessage('필수 항목들을 기입해주시길 바랍니다');
                setShowErrorModal(true);
                return;
            }

            const formPayload = new FormData();
            formPayload.append('public_name', formData.publicName);
            formPayload.append('opening_hours', formattedHours);
            formPayload.append('public_address', formData.publicLocation);
            formPayload.append('public_tel', formData.publicTel);
            if (formData.publicLogo) {
                formPayload.append('logo', formData.publicLogo);
            }

            const response = await axios.post(`${config.apiDomain}/public/publics/`, formPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.status === "success") {
                setMessage('입력하신 기관 정보가 등록 되었습니다');
                setShowMessageModal(true);
            } else {
                throw new Error('등록 중 오류가 발생했습니다.');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMsg = error.response.data.public_name || '기관 등록 중 오류가 발생했습니다. 다시 시도해주세요.';
                setErrorMessage(errorMsg);
                setShowErrorModal(true);
            } else {
                setErrorMessage('기관 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
                setShowErrorModal(true);
            }
        }
    };

    return (
        <div className="flex flex-col w-full max-w-md px-8 pt-8">
            <div className='text-center mb-2'>
                <h1 className="text-3xl font-bold text-indigo-600 mb-2" style={{ fontFamily: 'NanumSquareExtraBold' }}>기관 등록</h1>
                <p className="text-gray-600" style={{ fontFamily: 'NanumSquareBold' }}>기관 정보를 기입해주세요</p>
            </div>

            <div className="space-y-2">
                <TextInput 
                    id="publicName"
                    name="publicName"
                    label="이름"
                    placeholder="기관명"
                    value={formData.publicName}
                    onChange={handleInputChange}
                />
                <OpeningHoursSelector
                    weekdayHours={weekdayHours}
                    setWeekdayHours={setWeekdayHours}
                    weekendHours={weekendHours}
                    setWeekendHours={setWeekendHours}
                    isWeekendEnabled={isWeekendEnabled}
                    setIsWeekendEnabled={setIsWeekendEnabled}
                />
                <TextInput
                    id="publicLocation"
                    name="publicLocation"
                    label="위치"
                    placeholder="위치"
                    value={formData.publicLocation}
                    onChange={handleInputChange}
                />
                <TextInput
                    id="publicTel"
                    name="publicTel"
                    label="전화번호"
                    placeholder="전화번호"
                    value={formData.publicTel}
                    onChange={handleInputChange}
                />
                <FileInput
                    id="publicLogo"
                    name="publicLogo"
                    label="기관 로고"
                    onChange={handleFileChange}
                />
            </div>

            <button
                className="w-full bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg mt-5"
                onClick={handleRegisterPublic}
            >
                등록하기
            </button>

            <ModalMSG
                show={showMessageModal}
                onClose={handleMessageModalClose}
                title="Success"
            >
                <p style={{ whiteSpace: 'pre-line' }}>
                    {message}
                </p>
            </ModalMSG>

            <ModalErrorMSG
                show={showErrorModal}
                onClose={handleErrorModalClose}
                title="Error"
            >
                <p style={{ whiteSpace: 'pre-line' }}>
                    {errorMessage}
                </p>
            </ModalErrorMSG>
        </div>
    );
}
