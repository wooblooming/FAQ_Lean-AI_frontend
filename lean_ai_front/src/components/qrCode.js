// QRCodeSection.js
import React from 'react';

const QRCodeSection = ({
  stores, selectedStoreId, setSelectedStoreId,
  storeName, setStoreName, qrUrl, showQrCode,
  toggleQrCode, handleDownloadQrCode, handleGenerateQrCode
}) => {
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

      <button onClick={toggleQrCode} className="text-blue-400 underline text-sm font-semibold mb-2 ml-2 mt-2">
        {showQrCode ? 'QR 코드 접기' : 'QR 코드 보기'}
      </button>

      {showQrCode && qrUrl && (
        <div>
          <img src={qrUrl} alt="QR 코드" className="mx-auto " style={{ maxWidth: '85%' }} />
          <button
            className="text-sm text-gray-400 underline hover:text-blue-300"
            onClick={handleDownloadQrCode}
          >
            QR 코드 다운로드
          </button>
        </div>
      )}

      {!qrUrl && (
        <button className='border-none spacewhite-nowrap' style={{ color: '#007AFF' }} onClick={handleGenerateQrCode}>
          생성하기
        </button>
      )}
    </div>
  );
};

export default QRCodeSection;
