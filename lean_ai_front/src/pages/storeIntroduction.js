import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const StoreIntroduce = () => {
  const router = useRouter();
  const { id, qr } = router.query; // URL에서 store_id와 qr 파라미터 가져옴
  const [storeData, setStoreData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchStoreData = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/storesinfo/`, {
            params: {
              store_id: 1,
              qr: true,  // QR 코드로 접근한 경우 qr 파라미터 전달
            },
          });
          setStoreData(response.data);
        } catch (error) {
          console.error("Error fetching store data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchStoreData();
    }
  }, [id, qr]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!storeData) {
    return <div>Store not found.</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="border-blue-300 border p-5 rounded-lg shadow-lg flex flex-col items-center text-center mt-4 mb-2 w-10/12 h-3/6">
        <div className="rounded-lg p-8 w-full max-w-md text-center mb-2 relative">
          <img src={storeData.store_image} alt="Store" className="mx-auto mb-4 w-64 h-52 object-contain" />
          <p className="font-bold text-2xl">{storeData.store_name}</p>
        </div>

        <div className="bg-sky-100 flex flex-col rounded-lg items-center text-center mb-4 w-64 pt-3 px-2">
          <p className="mb-4 text-xl">{storeData.store_hours}</p>
        </div>

        <div className="bg-sky-100 flex flex-col rounded-lg items-center text-center w-64 mb-4 pt-3 px-2">
          <p className="mt-2 mb-4 text-xl">{storeData.menu_prices}</p>
        </div>
      </div>
    </div>
  );
};

export default StoreIntroduce;
