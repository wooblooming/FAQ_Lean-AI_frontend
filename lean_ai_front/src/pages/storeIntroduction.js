import React from 'react';
import Link from 'next/link';
import { useStore } from '../contexts/storeContext';

const StoreIntroduce = () => {
  const { storeName, storeHours, menuPrices, storeImage, isLoading } = useStore();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="border-blue-300 border p-5 rounded-lg shadow-lg flex flex-col items-center text-center mt-4 mb-2 w-10/12 h-3/6">
        <div className="rounded-lg p-8 w-full max-w-md text-center mb-2 relative">
          <img src={storeImage} alt="Store" className="mx-auto mb-4 w-64 h-52 object-contain" />
          <p className="font-bold text-2xl">{storeName}</p>
        </div>

        <div className="bg-sky-100 flex flex-col rounded-lg items-center text-center mb-4 w-64 pt-3 px-2">
          <p className="mb-4 text-xl">{storeHours}</p>
        </div>

        <div className="bg-sky-100 flex flex-col rounded-lg items-center text-center w-64 mb-4 pt-3 px-2">
          <p className="mt-2 mb-4 text-xl">{menuPrices}</p>
        </div>

        <Link href="/chatBot">
          <img src="/chatbot.png" alt="Chatbot" className="fixed bottom-4 right-4 w-20 h-20 object-fill bg-yellow-300 rounded-full" />
        </Link>
      </div>
    </div>
  );
};

export default StoreIntroduce;