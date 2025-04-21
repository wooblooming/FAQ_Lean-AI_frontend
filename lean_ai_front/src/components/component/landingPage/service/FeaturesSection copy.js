import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FileCode2, HelpCircle, Brain, FileText } from "lucide-react";

const FeaturesSection = () => {
  const [userType, setUserType] = useState("store");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const getFeaturesByType = (type) => {
    switch (type) {
      case "corp":
        return [
          {
            icon: FileCode2,
            title: "고객 문의, AI가 응대해요",
            description:
              "채팅 상담원 없이도 고객의 질문에 빠르게 응답! 고객 만족도는 올리고, CS 부담은 줄여보세요.",
          },
          {
            icon: HelpCircle,
            title: "사내 정보도 AI가 알려줘요",
            description:
              "내부 규정, 문서, 인사 정책 같은 사내 정보를 챗봇으로 빠르게 찾아볼 수 있어요.",
          },
          {
            icon: Brain,
            title: "문서 관리 자동화",
            description:
              "기본 양식 제공부터 문서 검색까지. 반복 업무에서 해방되고 중요한 일에 집중할 수 있어요.",
          },
          {
            icon: FileText,
            title: "문의 분석으로 서비스 개선",
            description:
              "어떤 문의가 많은지, 어떤 응답이 효과적인지 데이터 기반으로 파악할 수 있어요.",
          },
        ];
      case "public":
        return [
          {
            icon: FileCode2,
            title: "민원 접수도 챗봇으로 간편하게",
            description:
              "복잡한 민원 양식? 이제 챗봇을 통해 간편하게 접수 받고, 처리 상황도 한눈에 확인해요.",
          },
          {
            icon: HelpCircle,
            title: "조례·법률 검색도 AI에게",
            description:
              "공무원이 직접 검색하던 규정·법령도 챗봇이 빠르게 찾아주니 업무 효율 UP!",
          },
          {
            icon: Brain,
            title: "민원 응대 자동화",
            description:
              "반복되는 질문은 AI가 처리하고, 복잡한 건 담당자가 이어받아 빠르게 대응할 수 있어요.",
          },
          {
            icon: FileText,
            title: "데이터 기반 정책 개선",
            description:
              "민원 데이터를 분석해 어떤 정책이 필요한지, 시민이 원하는 서비스는 뭔지 파악할 수 있어요.",
          },
        ];
      default:
        return [
          {
            icon: FileCode2,
            title: "질문하면 바로 답이 와요!",
            description:
              "복잡하게 설명 안 해도 돼요. 질문만 입력하면, AI가 똑똑하게 이해하고 바로 적절한 답변을 드려요.",
          },
          {
            icon: HelpCircle,
            title: "자주 묻는 질문은 자동 응답!",
            description:
              "매번 같은 질문 받는 거 귀찮으셨죠? 무물은 FAQ를 자동으로 매칭해서 반복 응대에서 해방시켜줘요.",
          },
          {
            icon: Brain,
            title: "학습된 AI가 똑똑하게 대응",
            description:
              "가게에 맞게 학습된 AI가 고객 질문에 대해 정교한 답변을 제공해줘서, 신뢰도 높은 상담이 가능해요.",
          },
          {
            icon: FileText,
            title: "어떤 질문이 많았는지도 분석!",
            description:
              "고객들이 어떤 질문을 자주 하는지, 어떤 이슈가 많은지 통계를 통해 한눈에 파악할 수 있어요.",
          },
        ];
    }
  };

  const features = getFeaturesByType(userType);

  return (
    <section className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 relative inline-block">
          <span className="relative z-10 text-indigo-800" style={{ fontFamily: "NanumSquareExtraBold" }}>
            무물에서는 무엇을 할 수 있을까요?!
          </span>
          <motion.span
            className="absolute -bottom-2 left-0 h-4 bg-gradient-to-r from-indigo-400 to-violet-400 w-full z-0 opacity-60"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </h2>
        <p className="text-indigo-700 text-lg max-w-2xl mx-auto mb-8" style={{ fontFamily: "NanumSquare" }}>
          고객 질문에 최적화된 AI 기반 응대 솔루션으로 업무 효율성을 높여보세요
        </p>

        {/* 버튼 */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            className={`px-6 py-2 rounded-full font-semibold border ${
              userType === "store" ? "bg-indigo-600 text-white" : "bg-white text-indigo-600"
            }`}
            onClick={() => setUserType("store")}
          >
            소상공인용
          </button>
          <button
            className={`px-6 py-2 rounded-full font-semibold border ${
              userType === "corp" ? "bg-indigo-600 text-white" : "bg-white text-indigo-600"
            }`}
            onClick={() => setUserType("corp")}
          >
            기업용
          </button>
          <button
            className={`px-6 py-2 rounded-full font-semibold border ${
              userType === "public" ? "bg-indigo-600 text-white" : "bg-white text-indigo-600"
            }`}
            onClick={() => setUserType("public")}
          >
            공공기관용
          </button>
        </div>

        {/* 특징 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:mt-10 p-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="relative px-4 py-6 rounded-xl bg-indigo-50 shadow-lg aspect-square"
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <feature.icon
                className={`w-12 h-12 ${
                  hoveredIndex === index ? "text-indigo-600" : "text-indigo-400"
                } transition-colors duration-300`}
              />
              <h2
                className="py-4 text-2xl font-semibold text-indigo-800 whitespace-nowrap"
                style={{ fontFamily: "NanumSquareExtraBold" }}
              >
                {feature.title}
              </h2>
              <div className="text-xl font-semibold text-gray-700 h-32" style={{ fontFamily: "NanumSquare" }}>
                {feature.description}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
