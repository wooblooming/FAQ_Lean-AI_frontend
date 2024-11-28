import React from 'react';
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faClock, faPhone, faStore } from '@fortawesome/free-solid-svg-icons';

const StoreInfo = ({ storeData }) => (
  <div className="flex flex-col space-y-8 p-2">
    <div className="text-lg px-3" style={{ fontFamily: 'NanumSquare' }}>
      <h3 className="font-bold text-2xl" style={{ fontFamily: 'NanumSquareExtraBold' }}>매장 정보</h3>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex flex-col space-y-4 p-2'
      >
        {storeData.store_address && <InfoItem icon={faLocationDot} text={storeData.store_address} />}
        {storeData.store_hours && <InfoItem icon={faClock} text={storeData.store_hours} />}
        {storeData.store_tel && <InfoItem icon={faPhone} text={storeData.store_tel} />}
        {storeData.store_information && <InfoItem icon={faStore} text={storeData.store_information} />}
      </motion.div>
    </div>
  </div>
);

const InfoItem = ({ icon, text }) => (
  <div className="flex space-x-3 items-center">
    <FontAwesomeIcon icon={icon} className="text-indigo-500 text-xl" />
    <p className="whitespace-pre-line leading-normal">{text}</p>
  </div>
);

export default StoreInfo;
