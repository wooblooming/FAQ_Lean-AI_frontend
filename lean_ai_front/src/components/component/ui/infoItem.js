import React from "react";
import { ChevronRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * 매장 정보 수정 아이템 (Store Edit Info Item)
 */
export function StoreEditInfoItem({ icon: Icon, label, value, onEdit, noValue, editable = true }) {
  return (
    <div className="mb-5 group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="bg-indigo-50 p-1.5 rounded-full mr-2 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
            <Icon className="w-5 h-5" />
          </div>
          <label className="font-semibold text-gray-700">{label}</label>
        </div>
        {editable && (
          <button
            onClick={onEdit}
            className="text-indigo-500 hover:text-indigo-600 p-1.5 rounded-full hover:bg-indigo-50 transition-all duration-200 hover:scale-125"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
      {noValue ? (
        <div className="ml-9 flex items-center text-gray-400 italic text-sm">
          <AlertCircle className="h-4 w-4 mr-1.5" />
          정보를 입력해주세요
        </div>
      ) : (
        <div className="ml-9 text-gray-700 min-h-[1.5rem] break-words">{value || ""}</div>
      )}
      <div className="mt-3 ml-9 border-b border-gray-100"></div>
    </div>
  );
}

/**
 * 기관 정보 아이템 (Public Info Item)
 */
export function PublicInfoItem({ icon: Icon, text, label }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
      }}
      className="flex items-center space-x-4"
    >
      <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full shadow-sm">
        <Icon className="text-indigo-600 w-5 h-5" />
      </div>
      <div className="flex-1">
        {label === "기관명" ? (
          <p className="text-2xl font-bold text-gray-800 flex items-center">{text}</p>
        ) : (
          <>
            <p className="text-sm text-indigo-500 font-medium mb-1">{label}</p>
            <p className="text-base text-gray-800">{text}</p>
          </>
        )}
      </div>
    </motion.div>
  );
}


export function CorpInfoItem({ icon: Icon, text, label }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
      }}
      className="flex items-center space-x-4"
    >
      <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full shadow-sm">
        <Icon className="text-indigo-600 w-5 h-5" />
      </div>
      <div className="flex-1">
        {label === "기업명" ? (
          <p className="text-2xl font-bold text-gray-800 flex items-center">{text}</p>
        ) : (
          <>
            <p className="text-sm text-indigo-500 font-medium mb-1">{label}</p>
            <p className="text-base text-gray-800">{text}</p>
          </>
        )}
      </div>
    </motion.div>
  );
}

/**
 * 매장 정보 아이템 (Store Info Item)
 */
export function StoreInfoItem({ icon, text }) {
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
      <p className={`leading-normal ${isLongText ? "whitespace-pre-line" : "whitespace-nowrap"}`}>
        {text}
      </p>
    </motion.div>
  );
}
