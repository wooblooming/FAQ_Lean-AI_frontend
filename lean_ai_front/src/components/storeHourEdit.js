import React, { useState } from 'react';
import { Calendar, Clock, X } from 'lucide-react'; // X 아이콘 추가
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const StoreHourEdit = ({ isOpen, onClose, onSave, onDelete }) => {
    if (!isOpen) return null; // isOpen이 false면 모달을 렌더링하지 않음

    const [weekdayStartHour, setWeekdayStartHour] = useState('09');
    const [weekdayStartMinute, setWeekdayStartMinute] = useState('00');
    const [weekdayEndHour, setWeekdayEndHour] = useState('18');
    const [weekdayEndMinute, setWeekdayEndMinute] = useState('00');
    const [weekendStartHour, setWeekendStartHour] = useState('09');
    const [weekendStartMinute, setWeekendStartMinute] = useState('00');
    const [weekendEndHour, setWeekendEndHour] = useState('13');
    const [weekendEndMinute, setWeekendEndMinute] = useState('00');
    const [isWeekendEnabled, setIsWeekendEnabled] = useState(false);

    const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minuteOptions = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

    const handleSave = () => {
        const updatedHours = `평일: ${weekdayStartHour}:${weekdayStartMinute} ~ ${weekdayEndHour}:${weekdayEndMinute}, ` +
            (isWeekendEnabled ? `주말: ${weekendStartHour}:${weekendStartMinute} ~ ${weekendEndHour}:${weekendEndMinute}` : '주말 영업 안 함');
        onSave(updatedHours);
        onClose();
    };

    const handleDelete = () => {
        onDelete(); // 영업 시간 초기화
        onClose(); // 모달 닫기
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="modal-content bg-white p-6 rounded-lg shadow-lg text-center relative"
                style={{ width: '400px', position: 'relative' }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 px-2"
                    aria-label="Close"
                >
                    <X className="bg-indigo-500 rounded-full text-white p-1" />
                </button>
                <h2 className="text-2xl font-bold mb-4">영업 시간 수정</h2>
                <div className="space-y-1 p-3 bg-gray-100 rounded-lg">
                    {/* 평일 영업 시간 */}
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

                    {/* 주말 영업 시간 */}
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
                                    className="text-indigo-500"
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
                <div className='flex flex-row'>
                    <button
                        onClick={handleSave} // 확인 버튼 클릭 시 handleSave 호출
                        className="block w-full py-2 mt-4 text-blue-400 rounded"
                    >
                        확인
                    </button>
                    <button
                        onClick={handleDelete} // 확인 버튼 클릭 시 handleSave 호출
                        className="block w-full py-2 mt-4 text-red-400 rounded"
                    >
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StoreHourEdit;