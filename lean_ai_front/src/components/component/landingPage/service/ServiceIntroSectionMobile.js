"use client";
import { Repeat, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";

const ServiceIntroSection = () => {
  return (
    <section className="py-12 px-4 md:py-20 md:px-8 bg-white overflow-hidden">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-indigo-700 mb-8">
          무물은 이런 고민에서
          <br /> 시작됐습니다
        </h2>

        {/* 고민 카드 3개 */}
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          {[
            {
              icon: Repeat,
              text: "반복 질문에 지친 사장님들",
            },
            {
              icon: Clock,
              text: "자료 찾느라 시간 낭비하는 직원들",
            },
            {
              icon: Users,
              text: "문의 응대 인력 부족한 공무원들",
            },
          ].map(({ icon: Icon, text }, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-700">{text}</p>
            </motion.div>
          ))}
        </div>

        {/* 감정 메시지 */}
        <motion.div
          className="rounded-xl p-6 bg-indigo-500 text-white text-center mb-4 tracking-tighter"
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg font-semibold mb-1">
            "이걸 누가 알려줬으면 좋겠는데?"
          </p>
          <p className="text-sm">이런 생각, 해보신 적 있지 않나요?</p>
        </motion.div>

        {/* 무물 소개 */}
        <motion.div
          className="bg-white border border-indigo-200 rounded-xl p-4 shadow-md"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className=" leading-relaxed tracking-tighter">
            그래서 저희는{" "}
            <span className="text-indigo-600 font-semibold">무물</span>을
            만들었습니다.
            <br />"<strong>묻고 답해주는 챗봇</strong>"이라는 의미로,
            <br />
            <strong>'무엇이든 물어보세요'</strong>에서 따온 이름입니다.
          </p>
        </motion.div>

        {/* 챗봇 UI */}
        <div className="mt-8">
          <div className="rounded-xl overflow-hidden shadow-xl bg-indigo-800 relative h-80">
            <div className="flex items-center justify-between px-4 py-2 bg-indigo-900">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
              </div>
              <span className="text-sm text-white/80">무물 챗봇</span>
              <div></div>
            </div>

            <div className="bg-indigo-50 p-4 space-y-3 text-sm text-gray-800 ">
              <div className="flex flex-col space-y-3">
                <div className="self-end bg-indigo-500 text-white p-3 rounded-l-xl rounded-tr-xl self-end max-w-[80%]">
                  안녕하세요! 무엇을 도와드릴까요?
                </div>
                <div className="self-start bg-white p-3 rounded-r-xl rounded-tl-xl shadow-sm max-w-[80%]">
                  영업시간이 어떻게 되나요?
                </div>
                <div className="self-end bg-indigo-500 text-white p-3 rounded-l-xl rounded-tr-xl self-end max-w-[80%]">
                  평일 오전 9시부터 오후 6시까지입니다. 주말은 휴무입니다.
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 flex">
              <div className="flex-1 bg-white rounded-full flex items-center px-4 py-2">
                <span className="text-gray-400">메시지를 입력하세요...</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ServiceIntroSection;
