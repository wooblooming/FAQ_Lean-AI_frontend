import React, { useEffect } from 'react';

const QRCodeSection = ({
  stores, selectedStoreId, setSelectedStoreId,
  storeName, setStoreName, qrUrl, setQrUrl, showQrCode,
  toggleQrCode, handleDownloadQrCode, handleGenerateQrCode
}) => {

  // QR 코드 파일이 서버에 생성되었는지 확인하는 함수
  const checkQrCodeFileExists = async (url) => {
    try {
      const response = await fetch(url);
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // QR 코드 생성 후 폴링을 통해 파일이 존재하는지 확인하고 업데이트
  const handleGenerateAndDisplayQrCode = async () => {
    await handleGenerateQrCode(); // QR 코드 생성 함수 실행
    const newQrUrl = `${process.env.NEXT_PUBLIC_MEDIA_URL}/media/qr_codes/qr_${selectedStoreId}.png`; // 예상되는 QR 코드 경로 설정
    setQrUrl(newQrUrl); // QR 코드 URL 설정

    // 일정 시간 동안 주기적으로 파일이 생성되었는지 확인
    const pollInterval = 1000; // 1초 간격
    const maxAttempts = 15; // 최대 15번 시도 (15초)

    let attempts = 0;
    const pollForQrCode = setInterval(async () => {
      const fileExists = await checkQrCodeFileExists(newQrUrl);
      if (fileExists || attempts >= maxAttempts) {
        clearInterval(pollForQrCode); // 파일이 존재하거나 최대 시도 횟수에 도달하면 폴링 종료
        if (fileExists) {
          setQrUrl(newQrUrl); // 파일이 존재할 경우 QR 코드 이미지 업데이트
        }
      }
      attempts++;
    }, pollInterval);
  };

  return (
    <div className='flex flex-col items-start mb-4'>
      <div className='font-semibold mb-2 '>QR코드</div>

      <div className='flex flex-col items-start ml-2'>
        <label htmlFor="store-select" className="text-sm text-gray-400">스토어 선택</label>
        <select
          id="store-select"
          className="border-none border-b-2 border-blue-500 outline-none p-1"
          value={selectedStoreId || ''}
          onChange={(e) => {
            const selectedId = parseInt(e.target.value, 10);
            const selectedStore = stores.find(store => store.store_id === selectedId);
            setSelectedStoreId(selectedId);
            setStoreName(selectedStore?.store_name || '');
          }}
        >
          <option value="" disabled>스토어를 선택하세요</option>
          {stores.map((store) => (
            <option key={store.store_id} value={store.store_id}>
              {store.store_name}
            </option>
          ))}
        </select>
      </div>

      {/* QR 코드가 없는 경우 생성하기 버튼 표시 */}
      {!qrUrl ? (
        <button
          className='border-none text-blue-400 underline text-sm font-semibold mb-2 ml-2 mt-2'
          onClick={handleGenerateAndDisplayQrCode} // QR 코드 생성 및 즉시 표시
        >
          QR 코드 생성하기
        </button>
      ) : (
        <>
          {/* QR 코드 보기/접기 버튼 */}
          <button onClick={toggleQrCode} className="text-blue-400 underline text-sm font-semibold mb-2 ml-2 mt-2">
            {showQrCode ? 'QR 코드 접기' : 'QR 코드 보기'}
          </button>

          {/* QR 코드가 보일 때 이미지와 다운로드 버튼 표시 */}
          {showQrCode && (
            <div>
              <img src={qrUrl} alt="QR 코드" className="mx-auto" style={{ maxWidth: '85%' }} />
              <button
                className="text-sm text-gray-400 underline hover:text-blue-300"
                onClick={handleDownloadQrCode}
              >
                QR 코드 다운로드
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QRCodeSection;
