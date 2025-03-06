import React from "react";

export default function MenuActionButton({
  icon: Icon,
  title,
  description,
  onClick,
  color = "indigo",
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center p-4 bg-indigo-50 border border-indigo-100 rounded-xl transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] text-indigo-600 group"
    >
      <div className="bg-white border border-indigo-100 shadow-sm group-hover:bg-indigo-400 group-hover:text-white group-hover:border-indigo-400 p-2.5 rounded-full mr-4 transition-colors duration-300">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col items-start">
        <span className="font-medium text-gray-800 group-hover:text-indigo-700 transition-colors">
          {title}
        </span>
        <span className="text-xs text-gray-500">{description}</span>
      </div>
    </button>
  );
}