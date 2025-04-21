"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Store, Building2 } from "lucide-react";
import { useInView } from "react-intersection-observer";

import StoreList from "@/components/component/landingPage/service/usecases/StoreList";
import StoreDetail from "@/components/component/landingPage/service/usecases/StoreDetail";
import GalleryModal from "@/components/component/landingPage/service/usecases/GalleryModal";

const UsecaseSection = () => {
  const [usecaseStores, setUsecaseStores] = useState([]);
  const [visibleStoreId, setVisibleStoreId] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [sectionRef, sectionRefInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [titleRef, titleRefInView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  useEffect(() => {
    fetch("/text/usecase.json")
      .then((res) => res.json())
      .then((data) => {
        setUsecaseStores(data);
        if (data.length > 0) {
          setVisibleStoreId(data[0].id);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("데이터 로드 실패", err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    document.body.style.overflow = isGalleryOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isGalleryOpen]);

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "Store":
        return Store;
      case "Building2":
        return Building2;
      default:
        return Store;
    }
  };

  const handleNextImage = () => {
    const selectedStore = usecaseStores.find(
      (store) => store.id === visibleStoreId
    );
    if (!selectedStore) return;
    const total = selectedStore.images.length;
    setActiveImageIndex((prev) => (prev + 1) % total);
  };

  const handlePrevImage = () => {
    const selectedStore = usecaseStores.find(
      (store) => store.id === visibleStoreId
    );
    if (!selectedStore) return;
    const total = selectedStore.images.length;
    setActiveImageIndex((prev) => (prev - 1 + total) % total);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const staggerVariants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.3 },
      },
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    },
  };

  const selectedStore = usecaseStores.find((s) => s.id === visibleStoreId);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #c7d2fe 0%, #e0e7ff 50%, #ede9fe 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' ... %3E")`,
          backgroundSize: "30px 30px",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Title Section */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleRefInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center items-center text-center mb-16"
        >
          <div className="rounded-full px-6 py-3 bg-indigo-600 w-1/3">
            <h2
              className="text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "NanumSquareExtraBold" }}
            >
              무물 도입 사례
            </h2>
          </div>
          <p
            className="text-lg max-w-2xl mx-auto mt-6"
            style={{ fontFamily: "NanumSquare", color: "#4f46e5" }}
          >
            여러 사업장에서 무물을 도입하여 고객 서비스를 개선한 실제 사례를
            확인하세요
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial="hidden"
          animate={sectionRefInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              <StoreList
                stores={usecaseStores}
                activeId={visibleStoreId}
                onSelect={setVisibleStoreId}
                getIconComponent={getIconComponent}
                variants={staggerVariants}
              />
              {selectedStore && (
                <StoreDetail
                  store={selectedStore}
                  onOpenGallery={() => setIsGalleryOpen(true)}
                  setActiveImageIndex={setActiveImageIndex}
                />
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Gallery Modal */}
      <GalleryModal
        isOpen={isGalleryOpen}
        images={selectedStore?.images || []}
        activeIndex={activeImageIndex}
        onClose={() => setIsGalleryOpen(false)}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />
    </section>
  );
};

export default UsecaseSection;
