import React from "react";

export default function TabButton({ active, icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
        active
          ? "bg-indigo-600 text-white shadow-md"
          : "bg-white text-gray-700 hover:bg-indigo-50"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </button>
  );
}
