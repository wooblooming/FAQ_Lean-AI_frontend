import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [storeName, setStoreName] = useState('');
  const [storeHours, setStoreHours] = useState('');
  const [menuPrices, setMenuPrices] = useState('');
  const [storeImage, setStoreImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStoreData = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://:8000/api/storesinfo/`, {
        params: {
          store_id: id,  // 쿼리 파라미터로 store_id 전달
        },
      });
      const data = response.data;
      setStoreName(data.store_name);
      setStoreHours(data.store_hours);
      setMenuPrices(data.store_prices);
      setStoreImage(data.store_image);
    } catch (error) {
      console.error("Error fetching store data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StoreContext.Provider value={{
      storeName,
      storeHours,
      menuPrices,
      storeImage,
      isLoading,
      fetchStoreData,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
