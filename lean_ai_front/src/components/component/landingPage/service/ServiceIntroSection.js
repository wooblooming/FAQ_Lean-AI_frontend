"use client";
import { Repeat, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import TextBeltSection from "@/components/component/landingPage/service/TextBeltSection";

const ServiceIntroSection = () => {
  return (
    <section
      className="py-16 md:py-24 px-4 md:px-8 overflow-hidden relative"
      style={{ fontFamily: "NanumSquareBold" }}
    >
      {/* 스크롤 인/아웃 애니메이션 적용 */}
      <motion.div
        className="max-w-6xl mx-auto relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header with glowing effect */}
        <div className="text-center mb-20 relative">
          <h2
            className="relative text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-violet-500"
            style={{ fontFamily: "NanumSquareExtraBold" }}
          >
            무물은 이런 고민에서 시작됐습니다
          </h2>
        </div>

        <div className="grid md:grid-cols-12 gap-6 md:gap-8">
          {/* Left column */}
          <div className="md:col-span-7 space-y-6">
            <motion.div
              className="bg-indigo-50/50 rounded-2xl shadow-xl p-6 hover:scale-[1.02] transition-transform duration-300 border-t border-l border-indigo-50"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="grid md:grid-cols-3 gap-8 mb-16" style={{ fontFamily: "NanumSquare" }}>
                {[
                  { icon: Repeat, text: "고객의 반복적인 질문에 매번 답변하느라 지친 사장님들" },
                  { icon: Clock, text: "사내 자료를 찾느라 시간 허비하는 직원들" },
                  { icon: Users, text: "시민 문의 대응에 인력이 부족한 공무원들" },
                ].map(({ icon: Icon, text }, i) => (
                  <motion.div
                    key={i}
                    className="bg-white px-3 py-6 rounded-xl shadow-md border border-indigo-100 hover:scale-105 transition-transform duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ delay: i * 0.2, duration: 0.4, ease: "easeOut" }}
                  >
                    <Icon className="w-8 h-8 text-indigo-600 mb-4" />
                    <p className="leading-relaxed">{text}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="relative"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-indigo-600/5 rounded-xl"></div>
                <div className="relative py-5 px-6 rounded-xl backdrop-blur-sm border border-indigo-100 bg-indigo-500/70">
                  <p className="text-xl font-medium text-white mb-2">
                    "이걸 누가 대신 좀 알려줬으면 좋겠는데?"
                  </p>
                  <p className="text-white">이런 생각, 한 번쯤 해보셨죠?</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative group"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-400 to-violet-500 rounded-2xl blur opacity-30 group-hover:opacity-80 transition duration-1000"></div>
              <div className="relative bg-white rounded-2xl p-8 md:p-10">
                <p className="text-lg leading-relaxed">
                  그래서 저희는{" "}
                  <span className="text-indigo-600 font-semibold">무물</span>을
                  만들었습니다.
                  <br />
                  "<strong>묻고 답해주는 챗봇</strong>"이라는 의미로,
                  <br />
                  <strong>'무엇이든 물어보세요'</strong>에서 따온 이름입니다.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="md:col-span-5 relative">
            {/* 3D-looking chat interface mockup */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900 to-indigo-700 shadow-2xl transform rotate-2 md:rotate-3 hover:rotate-0 transition-all duration-500 h-full flex flex-col">
              <div className="h-10 bg-indigo-800 flex items-center px-4">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="mx-auto text-white/70 text-sm font-medium">
                  무물 AI 챗봇
                </div>
              </div>

              <div className="flex-1 bg-indigo-50/90 p-5 overflow-hidden">
                <div className="flex flex-col space-y-3">
                  <div className="self-end max-w-[80%] bg-indigo-500 text-white p-3 rounded-l-lg rounded-tr-lg">
                    안녕하세요! 무엇을 도와드릴까요?
                  </div>
                  <div className="self-start max-w-[80%] bg-white p-3 rounded-r-lg rounded-tl-lg shadow-sm">
                    영업시간이 어떻게 되나요?
                  </div>
                  <div className="self-end max-w-[80%] bg-indigo-500 text-white p-3 rounded-l-lg rounded-tr-lg">
                    평일 오전 9시부터 오후 6시까지입니다. 주말은 휴무입니다.
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 flex">
                  <div className="flex-1 bg-white rounded-full flex items-center px-4 py-2">
                    <span className="text-gray-400">
                      메시지를 입력하세요...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ServiceIntroSection;
