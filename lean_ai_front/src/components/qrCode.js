import React, { useEffect } from 'react';

// QRCodeSection 컴포넌트: QR 코드 생성, 보기, 다운로드 등의 기능을 제공
const QRCodeSection = ({
  stores,            // 사용자가 선택 가능한 스토어 목록
  selectedStoreId,   // 현재 선택된 스토어의 ID
  setSelectedStoreId, // 선택된 스토어 ID를 설정하는 함수
  storeName,         // 선택된 스토어의 이름
  setStoreName,      // 선택된 스토어의 이름을 설정하는 함수
  qrUrl,             // 생성된 QR 코드의 이미지 URL
  setQrUrl,          // QR 코드 이미지 URL을 설정하는 함수
  showQrCode,        // QR 코드 이미지가 보이는지 여부 (boolean)
  toggleQrCode,      // QR 코드 이미지의 표시 상태를 토글하는 함수
  handleDownloadQrCode, // QR 코드 이미지를 다운로드하는 함수
  handleGenerateQrCode   // QR 코드를 생성하는 함수
}) => {

  // 서버에 QR 코드 이미지 파일이 생성되었는지 확인하는 함수
  const checkQrCodeFileExists = async (url) => {
    try {
      const response = await fetch(url);
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // QR 코드 생성 및 폴링을 통해 파일 생성 여부 확인 및 QR 코드 표시
  const handleGenerateAndDisplayQrCode = async () => {
    await handleGenerateQrCode(); // QR 코드 생성 요청

    // 예상되는 QR 코드 파일 URL 설정
    const newQrUrl = `${process.env.NEXT_PUBLIC_MEDIA_URL}/media/qr_codes/qr_${selectedStoreId}.png`;
    setQrUrl(newQrUrl);

    // QR 코드 파일의 존재 여부를 확인하기 위해 폴링 설정
    const pollInterval = 1000; // 폴링 간격 (1초)
    const maxAttempts = 15; // 최대 시도 횟수 (15초 동안 폴링)

    let attempts = 0;
    const pollForQrCode = setInterval(async () => {
      const fileExists = await checkQrCodeFileExists(newQrUrl);
      if (fileExists || attempts >= maxAttempts) {
        clearInterval(pollForQrCode); // 파일이 생성되었거나 최대 시도 횟수에 도달하면 폴링 종료
        if (fileExists) {
          setQrUrl(newQrUrl); // 파일이 확인되면 QR 코드 URL 업데이트
        }
      }
      attempts++;
    }, pollInterval);
  };

  return (
    <div className='flex flex-col items-start mb-4'>
      <div className='font-semibold mb-2'>QR코드</div>

      {/* 스토어 선택 드롭다운 */}
      <div className='flex flex-col items-start ml-2'>
        <label htmlFor="store-select" className="text-sm text-gray-400">스토어 선택</label>
        <select
          id="store-select"
          className="border-none border-b-2 border-blue-500 outline-none p-1"
          value={selectedStoreId || ''}
          onChange={(e) => {
            const selectedId = parseInt(e.target.value, 10);
            const selectedStore = stores.find(store => store.store_id === selectedId);
            setSelectedStoreId(selectedId); // 선택된 스토어 ID 업데이트
            setStoreName(selectedStore?.store_name || ''); // 선택된 스토어 이름 업데이트
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

      {/* QR 코드 생성 버튼: QR 코드가 없는 경우에만 표시 */}
      {!qrUrl ? (
        <button
          className='border-none text-blue-400 underline text-sm font-semibold mb-2 ml-2 mt-2'
          onClick={handleGenerateAndDisplayQrCode} // QR 코드 생성 및 표시
        >
          QR 코드 생성하기
        </button>
      ) : (
        <>
          {/* QR 코드 보기/접기 버튼 */}
          <button onClick={toggleQrCode} className="text-blue-400 underline text-sm font-semibold mb-2 ml-2 mt-2">
            {showQrCode ? 'QR 코드 접기' : 'QR 코드 보기'}
          </button>

          {/* QR 코드 이미지와 다운로드 버튼 */}
          {showQrCode && (
            <div>
              <img src={qrUrl} alt="QR 코드" className="mx-auto" style={{ maxWidth: '85%' }} />
              <button
                className="text-sm text-gray-400 underline hover:text-blue-300"
                onClick={handleDownloadQrCode} // QR 코드 다운로드 함수 실행
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
