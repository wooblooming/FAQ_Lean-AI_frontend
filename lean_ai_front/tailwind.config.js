/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    './pages/**/*.{js,ts,jsx,tsx}',  // pages 폴더 안의 모든 파일
    './components/**/*.{js,ts,jsx,tsx}',  // components 폴더 안의 모든 파일
    './app/**/*.{js,ts,jsx,tsx}',  // 필요한 경우 app 폴더 추가
    './src/**/*.{js,ts,jsx,tsx}',  // src 폴더도 포함 가능
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
