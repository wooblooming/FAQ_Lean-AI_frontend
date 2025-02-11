import React from 'react';
import { ChevronLeft } from 'lucide-react';

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

const StoreBanner = ({ banner, onBack, isOwner }) => (
    <div className="relative">
        <img
            src={banner ? `${API_DOMAIN}${banner}` : '/images/mumullogo.jpg'}
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
