// components/usecase/StoreDetail.jsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Eye, MapPin, Star } from "lucide-react";

const StoreDetail = ({
  store,
  onOpenGallery,
  setActiveImageIndex,
  isMobile,
}) => {

  if (!store) return null;

  if (isMobile) {
    return (
      <motion.div
        key={store.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
        className="h-full flex flex-col w-full"
      >
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl overflow-hidden">
          <div className="relative h-28 sm:h-32 overflow-hidden">
            <div
              className="absolute inset-0 bg-center bg-cover"
              style={{
                backgroundImage: `url(${store.images[0]})`,
                filter: "blur(2px)",
                transform: "scale(1.1)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-500/85" />
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              <div className="flex justify-between items-start">
                <div className="w-5/6 sm:w-auto">
                  <h3
                    className="text-xl font-bold text-white mb-1 truncate"
                    style={{ fontFamily: "NanumSquareExtraBold" }}
                  >
                    {store.name.replace("\n", " ")}
                  </h3>
                  <div className="flex items-center gap-2 sm:gap-3 text-white/90 text-xs sm:text-sm flex-wrap">
                    <div className="flex items-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-white border border-white/30 truncate">
                        #{store.category || ""}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {store.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-5">
              <div className="bg-indigo-100 text-indigo-600 rounded-full px-3 py-1 text-xs sm:text-sm font-medium">
                # {store.category}
              </div>
              <div className="bg-violet-100 text-violet-600 rounded-full px-3 py-1 text-xs sm:text-sm font-medium">
                # 무물도입사례
              </div>
              <div className="bg-purple-100 text-purple-600 rounded-full px-3 py-1 text-xs sm:text-sm font-medium">
                # AI챗봇
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 sm:pt-5">
              <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3">
                도입 성과
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                {store.description}
              </p>

              <div className="mt-5 sm:mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base sm:text-lg font-bold text-gray-800">
                    도입 사진
                  </h4>
                  <motion.button
                    onClick={onOpenGallery}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="text-indigo-600 text-xs sm:text-sm font-medium flex items-center gap-1 hover:text-indigo-700"
                  >
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    모든 사진 보기
                  </motion.button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 overflow-hidden rounded-xl">
                  {store.images.slice(0, 4).map((src, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setActiveImageIndex(idx);
                        onOpenGallery();
                      }}
                      className="overflow-hidden rounded-xl cursor-pointer relative group"
                      style={{ aspectRatio: "1" }}
                    >
                      <img
                        src={src}
                        alt={`${store.name} 이미지 ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {idx ===
                        (window.innerWidth < 640
                          ? 1
                          : window.innerWidth < 768
                          ? 2
                          : 3) &&
                        store.images.length > 4 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-medium text-sm sm:text-base">
                            +{store.images.length - 4}장
                          </div>
                        )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={store?.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col w-full lg:w-2/3"
    >
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="relative h-32 overflow-hidden">
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{
              backgroundImage: `url(${store?.images?.[0]})`,
              filter: "blur(2px)",
              transform: "scale(1.1)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-500/85" />
          <div className="absolute inset-0 flex flex-col justify-between p-8">
            <div className="flex justify-between items-start">
              <div>
                <h3
                  className="text-2xl font-bold text-white mb-2"
                  style={{ fontFamily: "NanumSquareExtraBold" }}
                >
                  {store?.name?.replace("\n", " ")}
                </h3>
                <div className="flex items-center gap-3 text-white/90 text-sm">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {store?.location}
                  </div>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-white border border-white/30">
                #{store?.category || ""}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-3 mb-5">
            <div className="bg-indigo-100 text-indigo-600 rounded-full px-4 py-1.5 text-sm font-medium">
              # {store?.category}
            </div>
            <div className="bg-violet-100 text-violet-600 rounded-full px-4 py-1.5 text-sm font-medium">
              # 무물도입사례
            </div>
            <div className="bg-purple-100 text-purple-600 rounded-full px-4 py-1.5 text-sm font-medium">
              # AI챗봇
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-lg font-bold text-gray-800 mb-3">도입 성과</h4>
            <p className="text-gray-600">{store?.description}</p>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-gray-800">도입 사진</h4>
                <motion.button
                  onClick={onOpenGallery}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-indigo-600 text-sm font-medium flex items-center gap-1 hover:text-indigo-700"
                >
                  <Eye className="w-4 h-4" />
                  모든 사진 보기
                </motion.button>
              </div>

              <div className="grid grid-cols-4 gap-2 overflow-hidden rounded-xl">
                {store?.images?.slice(0, 4).map((src, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => openGalleryWithImage(idx)}
                    className="overflow-hidden rounded-xl cursor-pointer relative group"
                    style={{ aspectRatio: "1" }}
                  >
                    <img
                      src={src}
                      alt={`${store?.name} 이미지 ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {idx === 3 && store?.images?.length > 4 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-medium">
                        +{store?.images?.length - 4}장
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StoreDetail;
