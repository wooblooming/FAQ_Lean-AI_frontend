// OpeningHoursSelector Component
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const minuteOptions = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

const OpeningHoursSelector = ({
    weekdayHours,
    setWeekdayHours,
    weekendHours,
    setWeekendHours,
    isWeekendEnabled,
    setIsWeekendEnabled
}) => {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">운영 시간</label>
            <div className="space-y-0.5 p-3 bg-gray-100 rounded-lg">
                <div>
                    <div className="flex items-center space-x-2 text-gray-700">
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">평일</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <Select value={weekdayHours.startHour} onValueChange={(value) => setWeekdayHours({ ...weekdayHours, startHour: value })}>
                            <SelectTrigger className="w-[70px]"><SelectValue placeholder="시" /></SelectTrigger>
                            <SelectContent>
                                {hourOptions.map((hour) => (
                                    <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={weekdayHours.startMinute} onValueChange={(value) => setWeekdayHours({ ...weekdayHours, startMinute: value })}>
                            <SelectTrigger className="w-[70px]"><SelectValue placeholder="분" /></SelectTrigger>
                            <SelectContent>
                                {minuteOptions.map((minute) => (
                                    <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className="text-gray-500">~</span>
                        <Select value={weekdayHours.endHour} onValueChange={(value) => setWeekdayHours({ ...weekdayHours, endHour: value })}>
                            <SelectTrigger className="w-[70px]"><SelectValue placeholder="시" /></SelectTrigger>
                            <SelectContent>
                                {hourOptions.map((hour) => (
                                    <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={weekdayHours.endMinute} onValueChange={(value) => setWeekdayHours({ ...weekdayHours, endMinute: value })}>
                            <SelectTrigger className="w-[70px]"><SelectValue placeholder="분" /></SelectTrigger>
                            <SelectContent>
                                {minuteOptions.map((minute) => (
                                    <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="flex items-center justify-between">
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
                            <label htmlFor="weekend-mode">영업</label>
                        </div>
                    </div>
                    {isWeekendEnabled && (
                        <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <Select value={weekendHours.startHour} onValueChange={(value) => setWeekendHours({ ...weekendHours, startHour: value })}>
                                <SelectTrigger className="w-[70px]"><SelectValue placeholder="시" /></SelectTrigger>
                                <SelectContent>
                                    {hourOptions.map((hour) => (
                                        <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={weekendHours.startMinute} onValueChange={(value) => setWeekendHours({ ...weekendHours, startMinute: value })}>
                                <SelectTrigger className="w-[70px]"><SelectValue placeholder="분" /></SelectTrigger>
                                <SelectContent>
                                    {minuteOptions.map((minute) => (
                                        <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <span className="text-gray-500">~</span>
                            <Select value={weekendHours.endHour} onValueChange={(value) => setWeekendHours({ ...weekendHours, endHour: value })}>
                                <SelectTrigger className="w-[70px]"><SelectValue placeholder="시" /></SelectTrigger>
                                <SelectContent>
                                    {hourOptions.map((hour) => (
                                        <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={weekendHours.endMinute} onValueChange={(value) => setWeekendHours({ ...weekendHours, endMinute: value })}>
                                <SelectTrigger className="w-[70px]"><SelectValue placeholder="분" /></SelectTrigger>
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
    );
};

export default OpeningHoursSelector;