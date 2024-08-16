import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [storeName, setStoreName] = useState('');
  const [storeHours, setStoreHours] = useState('');
  const [menuPrices, setMenuPrices] = useState('');
  const [storeImage, setStoreImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/storeinfo/1/');
        const data = response.data;
        setStoreName(data.store_name);
        setStoreHours(data.store_hours);
        setMenuPrices(data.menu_prices);
        setStoreImage(data.store_image);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching store data:", error);
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  return (
    <StoreContext.Provider value={{
      storeName, setStoreName,
      storeHours, setStoreHours,
      menuPrices, setMenuPrices,
      storeImage, setStoreImage,
      isLoading
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