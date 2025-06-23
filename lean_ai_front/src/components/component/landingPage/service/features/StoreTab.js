"use client"
import { Store } from "lucide-react"
import FeatureCards from "./FeatureCards"
import BenefitList from "./BenefitList"
import { FileCode2, HelpCircle, Brain, FileText } from "lucide-react"

const StoreTab = () => {
  // 소상공인용 이점 데이터
  const storeAdvantages = [
    "1인 매장·소규모 매장 최적화",
    "자주 묻는 질문 자동 대응으로 인건비 절감",
    "운영 중 고객 문의 대응 시간 감소",
    "QR 코드 기반 챗봇 접점 제공으로 고객 접근성 향상",
    "반복 질문을 AI가 응대하여 사장님은 매장 운영에 집중",
    "정기 구독 기반으로 저렴한 비용으로 지속 이용 가능",
  ]

  // 소상공인 기능 데이터
  const storeFeatures = [
    {
      icon: FileCode2,
      title: "질문하면 AI가 바로 답해요",
      description: "복잡하게 설명할 필요 없어요. 질문만 입력하면, 고객 맞춤으로 딱 맞는 답변을 전달해줘요.",
    },
    {
      icon: HelpCircle,
      title: "자주 묻는 질문은 자동 응답!",
      description: "매번 똑같은 질문, 이제 그만! FAQ를 AI가 알아서 대응해줘서 응대 시간도 확 줄어요.",
    },
    {
      icon: Brain,
      title: "매장에 맞춘 똑똑한 챗봇",
      description: "우리 가게 특성에 맞게 학습된 AI가 정확하고 믿음직한 답변을 제공해줘요.",
    },
    {
      icon: FileText,
      title: "어떤 질문이 많은지도 한눈에",
      description: "반복되는 질문이나 자주 등장하는 이슈들을 자동으로 분석해줘서 운영에 도움돼요.",
    },
  ]

  // 색상 설정
  const colors = {
    primary: "#F59E0B",
    secondary: "#FBBF24",
    light: "#FEF3C7",
    dark: "#92400E",
    ultraDark: "#854D0E",
    gradientFrom: "#FCD34D",
    gradientTo: "#F59E0B",
  }

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* 기능 카드 섹션 */}
      <FeatureCards features={storeFeatures} colorScheme="amber" title={<>소상공인을 위한<br />무물의 특별한 기능</>}/>

      {/* 이점 섹션 */}
      <BenefitList
        title="소상공인을 위한 무물"
        description="개인 사업자와 소상공인을 위한 맞춤형 기능으로 최적의 솔루션을 제공합니다"
        benefits={storeAdvantages}
        colors={colors}
        icon={Store}
      />
    </div>
  )
}

export default StoreTab
