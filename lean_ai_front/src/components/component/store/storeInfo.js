import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faClock,
  faPhone,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import { formatPhoneNumber } from "@/utils/telUtils";

const StoreInfo = ({ storeData }) => (
  <div className="flex flex-col space-y-8 p-2">
    <div className="" style={{ fontFamily: "NanumSquare" }}>
      <motion.h2
        className="text-2xl font-bold text-gray-800 flex items-center min-w-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-1 h-6 bg-indigo-500 rounded-full mr-2"></div>
        <span style={{ fontFamily: "NanumSquareExtraBold" }}>매장 정보</span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col space-y-4 p-2 text-lg "
      >
        {storeData.store_address && (
          <InfoItem icon={faLocationDot} text={storeData.store_address} />
        )}
        {storeData.store_hours && (
          <InfoItem icon={faClock} text={storeData.store_hours} />
        )}
        {storeData.store_tel && (
          <InfoItem
            icon={faPhone}
            text={formatPhoneNumber(storeData.store_tel)}
          />
        )}
        {storeData.store_information && (
          <InfoItem icon={faStore} text={storeData.store_information} />
        )}
      </motion.div>
    </div>
  </div>
);

const InfoItem = ({ icon, text }) => {
  const isLongText = text.length > 20; // 길이에 따라 변경 기준 설정
  return (
    <div className="flex space-x-3 items-center">
      <FontAwesomeIcon icon={icon} className="text-indigo-500 text-xl" />
      <p
        className={`leading-normal ${
          isLongText ? "whitespace-pre-line" : "whitespace-nowrap"
        }`}
      >
        {text}
      </p>
    </div>
  );
};

export default StoreInfo;
