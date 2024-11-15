import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Calendar, Clock } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ModalMSG from '../components/modalMSG';
import ModalErrorMSG from '../components/modalErrorMSG';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import config from '../../config';

export default function RegisterPublic() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        publicName: '',
        publicLocation: '',
        publicTel: '',
    });
    const [weekdayStartHour, setWeekdayStartHour] = useState('09');
    const [weekdayStartMinute, setWeekdayStartMinute] = useState('00');
    const [weekdayEndHour, setWeekdayEndHour] = useState('18');
    const [weekdayEndMinute, setWeekdayEndMinute] = useState('00');
    const [weekendStartHour, setWeekendStartHour] = useState('09');
    const [weekendStartMinute, setWeekendStartMinute] = useState('00');
    const [weekendEndHour, setWeekendEndHour] = useState('13');
    const [weekendEndMinute, setWeekendEndMinute] = useState('00');
    const [isWeekendEnabled, setIsWeekendEnabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState('');

    const handleMessageModalClose = () => {
        setShowMessageModal(false);
        setMessage('');
        router.reload(); // 모달 닫을 때 페이지 새로고침
    };

    const handleErrorModalClose = () => {
        setShowErrorModal(false);
        setErrorMessage('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegisterPublic = async () => {

        try {
            const formattedHours = `평일: ${weekdayStartHour}:${weekdayStartMinute}-${weekdayEndHour}:${weekdayEndMinute}, ${isWeekendEnabled ? 
                `주말: ${weekendStartHour}:${weekendStartMinute}-${weekendEndHour}:${weekendEndMinute}` : '주말: 휴무'
                }`;

            if (!formData.publicName || !formattedHours || !formData.publicLocation || !formData.publicTel) {
                setErrorMessage('필수 항목들을 기입해주시길 바랍니다');
                setShowErrorModal(true);
                return;
            }

            const response = await axios.post(`${config.apiDomain}/public/public-register/`, {
                public_name: formData.publicName,
                opening_hours: formattedHours,
                public_address: formData.publicLocation,
                public_tel: formData.publicTel,
            });

            console.log('response data : ', response.data);

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

    const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minuteOptions = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

    return (
        <div className="flex flex-col space-y-5 w-full max-w-md px-8 pt-6 ">
            <div className='text-center'>
                <h1 className="text-3xl font-bold text-indigo-600 mb-2" style={{ fontFamily: 'NanumSquareExtraBold' }}>기관 등록</h1>
                <p className="text-gray-600" style={{ fontFamily: 'NanumSquareBold' }}>기관 정보를 기입해주세요</p>
            </div>

            <div>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="publicName" className="text-sm font-medium text-gray-700">이름</Label>
                        <input
                            id="publicName"
                            name="publicName"
                            placeholder='기관명'
                            value={formData.publicName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label className="text-sm font-medium text-gray-700">운영 시간</Label>
                        <div className="space-y-1 p-3 bg-gray-100 rounded-lg">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2 text-gray-700">
                                        <Calendar className="w-5 h-5" />
                                        <span className="font-medium">평일</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <Select value={weekdayStartHour} onValueChange={setWeekdayStartHour}>
                                        <SelectTrigger className="w-[70px]">
                                            <SelectValue placeholder="시" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {hourOptions.map((hour) => (
                                                <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={weekdayStartMinute} onValueChange={setWeekdayStartMinute}>
                                        <SelectTrigger className="w-[70px]">
                                            <SelectValue placeholder="분" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {minuteOptions.map((minute) => (
                                                <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <span className="text-gray-500">~</span>
                                    <Select value={weekdayEndHour} onValueChange={setWeekdayEndHour}>
                                        <SelectTrigger className="w-[70px]">
                                            <SelectValue placeholder="시" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {hourOptions.map((hour) => (
                                                <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={weekdayEndMinute} onValueChange={setWeekdayEndMinute}>
                                        <SelectTrigger className="w-[70px]">
                                            <SelectValue placeholder="분" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {minuteOptions.map((minute) => (
                                                <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="pt-2">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2 text-gray-700">
                                        <Calendar className="w-5 h-5" />
                                        <span className="font-medium">주말</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="weekend-mode"
                                            checked={isWeekendEnabled}
                                            onCheckedChange={setIsWeekendEnabled}
                                            className='text-indigo-500'
                                        />
                                        <Label htmlFor="weekend-mode">영업</Label>
                                    </div>
                                </div>
                                {isWeekendEnabled && (
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <Select value={weekendStartHour} onValueChange={setWeekendStartHour}>
                                            <SelectTrigger className="w-[70px]">
                                                <SelectValue placeholder="시" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {hourOptions.map((hour) => (
                                                    <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select value={weekendStartMinute} onValueChange={setWeekendStartMinute}>
                                            <SelectTrigger className="w-[70px]">
                                                <SelectValue placeholder="분" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {minuteOptions.map((minute) => (
                                                    <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <span className="text-gray-500">~</span>
                                        <Select value={weekendEndHour} onValueChange={setWeekendEndHour}>
                                            <SelectTrigger className="w-[70px]">
                                                <SelectValue placeholder="시" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {hourOptions.map((hour) => (
                                                    <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select value={weekendEndMinute} onValueChange={setWeekendEndMinute}>
                                            <SelectTrigger className="w-[70px]">
                                                <SelectValue placeholder="분" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {minuteOptions.map((minute) => (
                                                    <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="publicLocation" className="text-sm font-medium text-gray-700">위치</Label>
                        <input
                            id="publicLocation"
                            name="publicLocation"
                            placeholder='위치'
                            value={formData.publicLocation}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="publicTel" className="text-sm font-medium text-gray-700">전화번호</Label>
                        <input
                            id="publicTel"
                            name="publicTel"
                            placeholder='전화번호'
                            value={formData.publicTel}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>
            </div>

            <button
                className="w-full bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg"
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
