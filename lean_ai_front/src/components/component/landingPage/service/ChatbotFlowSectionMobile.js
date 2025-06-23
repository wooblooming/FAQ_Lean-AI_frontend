"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Sparkles, 
  SearchCheck, 
  MessageSquareText, 
  Reply,
  ChevronRight,
  BrainCircuit
} from "lucide-react";

const flowSteps = [
  {
    id: "step-1",
    icon: MessageSquareText,
    title: "질문 입력",
    description: "Q: 포장 되나요?",
  },
  {
    id: "step-2",
    icon: SearchCheck,
    title: "자연어 처리",
    description: '키워드 분석: "포장"',
  },
  {
    id: "step-3",
    icon: BrainCircuit,
    title: "FAQ or AI 검색",
    description: "등록 데이터 / LLM 활용",
  },
  {
    id: "step-4",
    icon: Reply,
    title: "응답 제공",
    description: 'A: "포장 가능합니다!"',
  },
];

export default function ChatbotFlowSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 to-indigo-100 overflow-hidden">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-bold text-indigo-700 text-center mb-8">
          무물 챗봇 작동 과정
        </h2>

        <div className="space-y-4">
          {flowSteps.map((step, index) => {
            const isActive = activeStep === index;
            const StepIcon = step.icon;
            return (
              <motion.div
                key={step.id}
                className={`p-4 flex items-center gap-4 rounded-xl bg-white shadow-md cursor-pointer transition-all duration-300 ${
                  isActive ? "border-2 border-indigo-500" : "border"
                }`}
                onClick={() => setActiveStep(index)}
              >
                <div className={`w-12 h-12 flex items-center justify-center rounded-full ${isActive ? "bg-indigo-500 text-white" : "bg-indigo-100 text-indigo-500"}`}>
                  <StepIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-indigo-700">
                    {step.title}
                  </h4>
                  <AnimatePresence>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-gray-500 mt-1 overflow-hidden"
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <ChevronRight className="w-4 h-4 text-indigo-400" />
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {flowSteps.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${activeStep === idx ? "bg-indigo-500" : "bg-indigo-200"}`}
            onClick={() => setActiveStep(idx)}
          />
        ))}
      </div>
    </section>
  );
}
