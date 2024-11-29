import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../config';

const QRCodeSection = ({
  isPublicOn,
  token,
  storeID,
  userData,
  qrUrl, setQrUrl,
  showQrCode,
  toggleQrCode,
  handleDownloadQrCode,
  handleGenerateQrCode
}) => {

  // QR 코드 존재 여부 확인
  useEffect(() => {
    if (!userData) return;
    // `userData.qr_code_url`이 존재하면 NEXT_PUBLIC_MEDIA_URL과 조합하여 저장
    if (userData.qr_code_url) {
      const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL; // 환경 변수에서 URL 가져오기
      setQrUrl(`${mediaUrl}/${userData.qr_code_url}`);
    } 
  }, [userData]);


  // QR 코드 생성 및 업데이트
  const handleGenerateAndDisplayQrCode = async () => {
    await handleGenerateQrCode();
    setQrUrl(`${config.apiDomain}/media/qr_codes/${isPublicOn ? 'public_qr' : 'store_qr'}_${storeID}.png`);
  };

  return (
    <div className="flex flex-col items-start mb-5">
      <div className="font-semibold mb-2 text-lg" style={{ fontFamily: "NanumSquareExtraBold" }}>
        QR코드
      </div>
      <div className="flex flex-col items-start space-y-1 px-2">
        <label htmlFor="store-select" className="text-sm text-gray-400" style={{ fontFamily: "NanumSquare" }}>
          {userData.business_name}
        </label>
      </div>

      {!qrUrl ? (
        <button
          className="border-none text-blue-400 underline"
          onClick={handleGenerateAndDisplayQrCode}
          style={{ fontFamily: "NanumSquareBold" }}
        >
          QR 코드 생성하기
        </button>
      ) : (
        <div className="flex flex-col items-start justify-center">
          <div className="px-2 py-1">
            <button
              onClick={toggleQrCode}
              className="text-blue-400 underline"
              style={{ fontFamily: "NanumSquareExtraBold" }}
            >
              {showQrCode ? 'QR 코드 접기' : 'QR 코드 보기'}
            </button>
          </div>
          {showQrCode && (
            <div className="flex flex-col items-center px-2">
              <img src={qrUrl} alt="QR 코드" style={{ maxWidth: '85%' }} />
              <button
                className="text-gray-400 underline hover:text-blue-300"
                onClick={handleDownloadQrCode}
                style={{ fontFamily: "NanumSquareExtraBold" }}
              >
                QR 코드 다운로드
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QRCodeSection;
