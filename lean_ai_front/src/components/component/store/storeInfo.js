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
  <div className="flex flex-col space-y-8">
    <div style={{ fontFamily: "NanumSquare" }}>
      {/* 제목 */}
      <motion.h2
        className="text-2xl font-bold text-gray-800 flex items-center min-w-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-1.5 h-8 bg-indigo-600 rounded-r mr-3"></div>
        <span style={{ fontFamily: "NanumSquareExtraBold" }}>매장 정보</span>
      </motion.h2>

      {/* InfoItem 리스트 - 애니메이션 그룹 적용 */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }, // **순차적으로 애니메이션 실행**
          },
        }}
        className="flex flex-col space-y-4 p-2 text-lg"
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
  const isLongText = text.length > 20;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
      }}
      className="flex items-center space-x-4"
    >
      <FontAwesomeIcon icon={icon} className="text-indigo-500 text-xl" />
      <p
        className={`leading-normal ${
          isLongText ? "whitespace-pre-line" : "whitespace-nowrap"
        }`}
      >
        {text}
      </p>
    </motion.div>
  );
};

export default StoreInfo;