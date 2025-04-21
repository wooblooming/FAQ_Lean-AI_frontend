"use client";

import React from "react";
import ServiceIntroSection from "@/components/component/landingPage/service/ServiceIntroSection";
import TextBeltSection from "@/components/component/landingPage/service/TextBeltSection";
import FeaturesSection from "@/components/component/landingPage/service/features/FeaturesSection";
import ChatbotFlowSection from "@/components/component/landingPage/service/ChatbotFlowSection";
import UsecaseSection from "@/components/component/landingPage/service/usecases/UsecaseSection";
import OnboardingProcessSection from "@/components/component/landingPage/service/OnboardingProcessSection";


const ServiceSection = ({ isMobile, isTablet, isDesktop }) => {
  return (
    <div className="flex flex-col">
      <ServiceIntroSection />       {/* 서비스 소개 섹션*/}
      <TextBeltSection />           {/* 서비스 홍보 문구 섹션*/}
      <ChatbotFlowSection />        {/* 챗봇 응답 흐름 소개 섹션*/}
      <FeaturesSection />           {/* 서비스 특장 섹션*/}
      <UsecaseSection />            {/* 서비스 도입 사례 섹션*/}
      <OnboardingProcessSection />  {/* 서비스 도입 절차 소개 섹션*/}
    </div>
  );
};

export default ServiceSection;
