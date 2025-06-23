"use client"
import { Building } from "lucide-react"
import FeatureCards from "./FeatureCards"
import BenefitList from "./BenefitList"
import { FileCode2, HelpCircle, Brain, FileText } from "lucide-react"

const CorpTab = () => {
  // 기업용 이점 데이터
  const corpAdvantages = [
    "CS 챗봇으로 상담 인력 리소스 절약",
    "RAG 기반 답변으로 복잡한 질문에도 높은 정확도 제공",
    "사내 지식 검색 자동화로 내부 문의 대응 부담 감소",
    "법률/지침/사내 문서도 자연어 검색 가능",
    "챗봇 대화 통계 기반 VOC 인사이트 확보 가능 (예정)",
  ]

  // 기업 기능 데이터
  const corpFeatures = [
    {
      icon: FileCode2,
      title: "고객 문의, AI가 24시간 대응",
      description: "상담 인력이 부족해도 걱정 없어요. AI가 빠르게 고객 질문에 응답해 만족도를 높여줘요.",
    },
    {
      icon: HelpCircle,
      title: "사내 정보도 빠르게 검색",
      description: "사규, 문서, 인사 정책 등 내부 정보를 챗봇이 빠르게 찾아줘서 업무 효율이 올라가요.",
    },
    {
      icon: Brain,
      title: "문서 관리와 업무 자동화",
      description: "기본 양식부터 문서 검색까지 챗봇이 도와줘서 반복 업무에서 해방될 수 있어요.",
    },
    {
      icon: FileText,
      title: "문의 분석으로 서비스 개선",
      description: "고객이 많이 묻는 질문, 자주 발생하는 이슈를 분석해 더 나은 서비스를 만들 수 있어요.",
    },
  ]

  // 색상 설정
  const colors = {
    primary: "#10B981",
    secondary: "#34D399",
    light: "#D1FAE5",
    dark: "#166534",
    ultraDark: "#166534",
    gradientFrom: "#6EE7B7",
    gradientTo: "#10B981",
  }

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* 기능 카드 섹션 */}
      <FeatureCards features={corpFeatures} colorScheme="emerald" title={<>기업을 위한<br />무물의 특별한 기능</>} />

      {/* 이점 섹션 */}
      <BenefitList
        title="기업을 위한 무물"
        description="기업 맞춤형 기능으로 효율적인 고객 응대와 내부 커뮤니케이션을 지원합니다"
        benefits={corpAdvantages}
        colors={colors}
        icon={Building}
      />
    </div>
  )
}

export default CorpTab
