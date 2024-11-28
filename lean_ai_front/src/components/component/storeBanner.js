import React from 'react';
import { ChevronLeft } from 'lucide-react';
import config from '../../../config';

const StoreBanner = ({ banner, onBack, isOwner }) => (
    <div className="relative">
        <img
            src={banner ? `${config.apiDomain}${banner}` : '/mumullogo.jpg'}
            alt="Store"
            className="w-full h-48 object-cover"
        />
        {isOwner &&
            <ChevronLeft
                className="absolute top-4 left-4 items-center bg-indigo-500 rounded-full text-white p-1 cursor-pointer"
                onClick={onBack}
            />
        }
    </div>
);

export default StoreBanner;
