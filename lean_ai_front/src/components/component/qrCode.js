import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';
import config from '../../../config';

const QRCodeSection = ({
  storeID,
  publicName,
  qrUrl,
  setQrUrl,
  showQrCode,
  toggleQrCode,
  handleDownloadQrCode,
  handleGenerateQrCode
}) => {

  const { token } = useAuth();

  // QR 코드 존재 여부를 확인하여 초기 설정
  useEffect(() => {
    if (storeID && token) {
      const fetchQrCodeUrl = async () => {
        try {
          const response = await fetch(`${config.apiDomain}/public/qrCodeImage/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ public_id: storeID })
          });
          const data = await response.json();
          if (data.qr_code_image_url) {
            setQrUrl(data.qr_code_image_url); // 이미 생성된 QR 코드의 URL을 설정
          }
        } catch (error) {
          console.error('QR 코드 URL 로드 중 오류 발생:', error);
        }
      };

      if (!qrUrl) {
        fetchQrCodeUrl(); // 처음 로드 시 QR 코드가 이미 있는지 확인
      }
    }
  }, [storeID, token, qrUrl, setQrUrl]);

  // QR 코드 생성 및 URL 업데이트
  const handleGenerateAndDisplayQrCode = async () => {
    await handleGenerateQrCode();
    setQrUrl(`${process.env.NEXT_PUBLIC_MEDIA_URL}/media/qr_codes/public_qr_${storeID}.png`);
  };

  return (
    <div className='flex flex-col items-start mb-5'>
      <div className='font-semibold mb-2 text-lg' style={{ fontFamily: "NanumSquareExtraBold" }}>QR코드</div>
      <div className='flex flex-col items-start space-y-1 px-2'>
        <label htmlFor="store-select" className="text-sm text-gray-400" style={{ fontFamily: "NanumSquare" }}>
          {publicName}
        </label>
      </div>

      {!qrUrl ? (
        <button
          className='border-none text-blue-400 underline'
          onClick={handleGenerateAndDisplayQrCode}
          style={{ fontFamily: "NanumSquareBold" }}
        >
          QR 코드 생성하기
        </button>
      ) : (
        <div className='flex flex-col items-start justify-center'>
          <div className='px-2 py-1'>
            <button onClick={toggleQrCode} className="text-blue-400 underline" style={{ fontFamily: "NanumSquareExtraBold" }}>
              {showQrCode ? 'QR 코드 접기' : 'QR 코드 보기'}
            </button>
          </div>
          {showQrCode && (
            <div className='flex flex-col items-center px-2'>
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
