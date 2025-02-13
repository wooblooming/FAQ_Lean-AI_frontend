import React, { useState } from "react";
import { useRouter } from "next/router";
import { ChevronLeft, Award, CalendarCheck2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import timelineData from "/public/text/timeline.json";

const TimelineEvent = ({ content, type }) => {
  return (
    <div className="flex group items-start space-x-2 md:space-x-6 relative py-2 pl-6 md:pl-8">
      <div className="absolute left-5 top-0 h-full w-px bg-indigo-200 group-hover:bg-indigo-400 transition-colors duration-300" />

      <div
        className="bg-white rounded-2xl px-6 py-4 shadow-sm hover:shadow-md transition-all duration-300 border border-indigo-50"
        style={{ width: "90%" }}
      >
        {type === "award" && (
          <Award className="h-5 w-5 text-indigo-500 mb-3 inline-block" />
        )}
        {type === "history" && (
          <CalendarCheck2 className="h-5 w-5 text-indigo-500 mb-3 inline-block" />
        )}
        <p className="text-gray-600 leading-relaxed">{content}</p>
      </div>
    </div>
  );
};

const YearMarker = ({ period, onClick, isOpen }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer my-8 transform transition-all duration-300"
    >
      <div className="flex items-center space-x-4">
        <div className="flex-grow">
          <div className="flex items-center">
            <div
              className="flex w-auto font-bold text-xl md:text-3xl text-gray-500 whitespace-nowrap"
              style={{ fontFamily: "NanumSquareExtraBold" }}
            >
              {period}
            </div>
            <div
              className={`w-full border-b-2 flex-grow ml-4 transition-all duration-300 ${
                isOpen ? "border-indigo-600" : "border-indigo-300"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Timeline = () => {
  const [openPeriods, setOpenPeriods] = useState({});
  const router = useRouter();

  const togglePeriod = (period) => {
    setOpenPeriods((prev) => ({
      ...prev,
      [period]: !prev[period],
    }));
  };

  return (
    <div className="min-h-screen bg-violet-50 p-8">
      <div className="max-w-4xl mx-auto py-12 px-8  bg-white rounded-lg shadow-xl">
        <div className="flex flex-row">
          <ChevronLeft
            className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
            onClick={() => router.back()}
          />
          <h1 className="text-3xl md:text-4xl font-bold text-left text-indigo-600 mb-4 whitespace-nowrap" style={{ fontFamily: "NanumSquareExtraBold" }}>
            린에이아이의 걸어온 길
          </h1>
        </div>

        <div className="px-6 space-y-3">
          {timelineData.map((periodData) => (
            <React.Fragment key={periodData.period}>
              <YearMarker
                period={periodData.period}
                onClick={() => togglePeriod(periodData.period)}
                isOpen={openPeriods[periodData.period]}
              />

              <AnimatePresence>
                {openPeriods[periodData.period] && (
                  <motion.div
                    key={periodData.period}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="overflow-y-auto max-h-[400px] space-y-2"
                  >
                    {periodData.awards?.map((award, index) => (
                      <TimelineEvent
                        key={index}
                        content={award.content}
                        type="award"
                        showIndicator={index === 0}
                      />
                    ))}
                    {periodData.history?.map((history, index) => (
                      <TimelineEvent
                        key={index}
                        content={history.content}
                        type="history"
                        showIndicator={
                          index === 0 && !periodData.awards?.length
                        }
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
