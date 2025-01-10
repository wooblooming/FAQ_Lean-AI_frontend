import React, { useState } from "react";
import { useRouter } from "next/router";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import timelineData from "/public/text/timeline.json";

const TimelineEvent = ({ content }) => {
  return (
    <div className="flex items-center space-x-4 md:space-x-16 group relative transition-all duration-500 ease-out px-2">
      <div className="w-full flex-grow py-2">
        <p
          className="text-base text-gray-500 font-medium"
          style={{ fontFamily: "NanumSquare" }}
        >
          {content}
        </p>
      </div>
    </div>
  );
};

const YearMarker = ({ year, onClick, isOpen }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer my-3 flex items-center transition-all duration-300 ease-in-out"
    >
      <div className="flex-shrink-0 w-12 md:w-24 font-bold text-xl md:text-3xl text-gray-600">
        {year}
      </div>
      <div
        className={`w-full border-b-2 flex-grow ml-4 transition-all duration-300 ${
          isOpen ? "border-indigo-600" : "border-indigo-300"
        }`}
      />
    </div>
  );
};

const Timeline = () => {
  const [openYears, setOpenYears] = useState({});
  const router = useRouter();

  const toggleYear = (year) => {
    setOpenYears((prevOpenYears) => ({
      ...prevOpenYears,
      [year]: !prevOpenYears[year],
    }));
  };

  return (
    <div className="min-h-screen p-4 font-sans bg-violet-50">
      <div
        className="max-w-4xl mx-auto py-12 px-6 shadow-md rounded-lg bg-white"
        style={{ borderRadius: "50px 0 50px 0" }}
      >
        <div className="flex items-center mb-12">
          <ChevronLeft
            className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
            onClick={() => router.push("/")}
          />
          <h1
            className="text-2xl md:text-4xl font-bold text-center text-indigo-600"
            style={{ fontFamily: "NanumSquareExtraBold" }}
          >
            린에이아이의 걸어온 길
          </h1>
        </div>

        <div className="max-w-3xl mx-auto">
          {timelineData.map((yearData) => (
            <React.Fragment key={yearData.year}>
              <YearMarker
                year={yearData.year}
                onClick={() => toggleYear(yearData.year)}
                isOpen={!!openYears[yearData.year]}
              />

              <AnimatePresence>
                {openYears[yearData.year] && (
                  <motion.div
                    key={yearData.year}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    {yearData.awards &&
                      yearData.awards.map((award, index) => (
                        <TimelineEvent key={index} content={award} />
                      ))}
                    {yearData.history && (
                      <TimelineEvent content={yearData.history} />
                    )}
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
