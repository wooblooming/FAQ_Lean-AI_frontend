import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const TextBeltSection = () => {
  const [beltRef, beltInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <section className="my-12">
      <motion.div
        className="py-10 w-full"
        ref={beltRef}
        initial="hidden"
        animate={beltInView ? "visible" : "hidden"}
        variants={fadeInUp}
      >
        <div
          className="-skew-y-3 h-auto flex flex-col text-center text-white w-full py-7 bg-violet-600/80"
          style={{ fontFamily: "NanumSquareBold" }}
        >
          <p style={{ fontFamily: "NanumSquareExtraBold", fontSize: "36px" }}>
            무물은 단순한 챗봇이 아닙니다.
            <br />
            <span style={{ fontFamily: "NanumSquareBold", fontSize: "24px" }}>
              업종에 맞게 최적화된 AI FAQ 플랫폼으로, <br />
              고객 응대를 자동화하고 시간을 절약해주는 스마트한 도우미입니다.
            </span>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default TextBeltSection;
