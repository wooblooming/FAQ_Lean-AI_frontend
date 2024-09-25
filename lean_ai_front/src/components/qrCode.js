import React, { useEffect } from 'react';

const QRCodeSection = ({
  stores, selectedStoreId, setSelectedStoreId,
  storeName, setStoreName, qrUrl, setQrUrl, showQrCode,
  toggleQrCode, handleDownloadQrCode, handleGenerateQrCode
}) => {

  // QR 코드 URL이 상대 경로일 경우에만 절대 경로로 변환
  useEffect(() => {
    console.log(qrUrl);
    if (qrUrl && !qrUrl.startsWith("https://mumulai.com/media/")) {
      // QR 코드 URL이 "https://mumulai.com/media/"로 시작하지 않으면 절대 경로로 변환
      setQrUrl(`${qrUrl}`);
    }
  }, [qrUrl]);

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
          onClick={handleGenerateQrCode}
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
