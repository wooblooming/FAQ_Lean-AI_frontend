import React from "react";
import LoadingSpinner from '@/components/ui/loadingSpinner';

export default function LoadingSection({ message= "잠시만 기다려 주세요!" }) {
  return (
    <div className="flex flex-col space-y-5 justify-center items-center min-h-screen bg-violet-50">
      <LoadingSpinner />
      <p className="text-xl" style={{ fontFamily: "NanumSquareBold" }}>
        {message}
      </p>
    </div>
  );
}
