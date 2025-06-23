"use client";

import React from "react";
import ServiceIntroSection from "@/components/component/landingPage/service/ServiceIntroSection";
import TextBeltSection from "@/components/component/landingPage/service/TextBeltSection";
import FeaturesSection from "@/components/component/landingPage/service/features/FeaturesSection";
import ChatbotFlowSection from "@/components/component/landingPage/service/ChatbotFlowSection";
import UsecaseSection from "@/components/component/landingPage/service/usecases/UsecaseSection";
import OnboardingProcessSection from "@/components/component/landingPage/service/OnboardingProcessSection";

import ServiceIntroSectionMobile from "@/components/component/landingPage/service/ServiceIntroSectionMobile";
import FeaturesSectionMobile from "@/components/component/landingPage/service/features/FeaturesSectionMobile";
import ChatbotFlowSectionMobile from "@/components/component/landingPage/service/ChatbotFlowSectionMobile";
import UsecaseSectionMobile from "@/components/component/landingPage/service/usecases/UsecaseSectionMobile";
import OnboardingProcessSectionMobile from "@/components/component/landingPage/service/OnboardingProcessSectionMobile";


const ServiceSection = ({ isMobile, isTablet, isDesktop }) => {
  return (
    <div className="flex flex-col">
      {isMobile ? (
        <>
          <ServiceIntroSectionMobile />
          <ChatbotFlowSectionMobile />
          <FeaturesSectionMobile />
          <UsecaseSectionMobile />
          <OnboardingProcessSectionMobile />
        </>
      ) : (
        <>
          <ServiceIntroSection />
          <TextBeltSection />
          <ChatbotFlowSection />
          <FeaturesSection />
          <UsecaseSection />
          <OnboardingProcessSection />
        </>
      )}
    </div>
  );
};

export default ServiceSection;
