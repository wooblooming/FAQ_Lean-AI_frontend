"use client";

import React from "react";
import { Landmark } from "lucide-react";
import FeatureCards from "./FeatureCards";
import BenefitList from "./BenefitList";
import { 
  FileCode2, 
  HelpCircle, 
  Brain, 
  FileText
} from "lucide-react";

const PublicTab = () => {
  // 공공기관용 이점 데이터
  const publicAdvantages = [
    "자주 접수되는 민원 자동 응답으로 처리 속도 향상",
    "민원 접수 → 답변까지 백오피스 UI로 통합 관리",
    "행정 서식 및 법령 검색 자동화로 직원 편의성 향상",
    "기관 담당자 맞춤형 응답 기능 제공",
    "반복적인 민원 응대에 따른 직원 감정소모 완화",
  ];

  // 공공기관 기능 데이터
  const publicFeatures = [
    {
      icon: FileCode2,
      title: "민원 접수, 챗봇으로 간편하게",
      description:
        "복잡한 양식 없이도 챗봇을 통해 민원을 접수하고 처리 현황도 쉽게 확인할 수 있어요.",
    },
    {
      icon: HelpCircle,
      title: "조례·법령 검색도 AI에게",
      description:
        "직접 찾던 규정이나 법률도 AI 챗봇이 빠르게 검색해줘서 공무원 업무가 훨씬 쉬워져요.",
    },
    {
      icon: Brain,
      title: "반복 민원은 자동 응대",
      description:
        "반복되는 단순 문의는 AI가 처리하고, 복잡한 민원은 담당자에게 자동으로 연결해줘요.",
    },
    {
      icon: FileText,
      title: "민원 데이터를 정책에 활용",
      description:
        "AI가 민원 데이터를 분석해 시민이 원하는 정책과 서비스 방향을 제안해줘요.",
    },
  ];
  
  // 색상 설정
  const colors = {
    primary: "#0EA5E9",
    secondary: "#38BDF8",
    light: "#E0F2FE",
    dark: "#075985",
    ultraDark: "#075985",
    gradientFrom: "#38BDF8",
    gradientTo: "#0EA5E9",
  };

  return (
    <div>
      {/* 기능 카드 섹션 */}
      <FeatureCards 
        features={publicFeatures} 
        colorScheme="sky" 
        title="공공기관을 위한 무물의 특별한 기능"
      />
      
      {/* 이점 섹션 */}
      <BenefitList
        title="공공기관을 위한 무물"
        description="민원 처리 자동화와 업무 효율화를 통한 행정 서비스 품질 향상"
        benefits={publicAdvantages}
        colors={colors}
        icon={Landmark}
      />
    </div>
  );
};

export default PublicTab;