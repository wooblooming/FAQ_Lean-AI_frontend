/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx}", // pages 폴더 안의 모든 파일
    "./components/**/*.{js,ts,jsx,tsx}", // components 폴더 안의 모든 파일
    "./app/**/*.{js,ts,jsx,tsx}", // 필요한 경우 app 폴더 추가
    "./src/**/*.{js,ts,jsx,tsx}", // src 폴더도 포함 가능
  ],
  theme: {
    extend: {
      fontFamily: {
        NanumSquare: ["NanumSquare", "sans-serif"],
		NanumSquareBold: ["NanumSquareBold", "sans-serif"], // ✅ 여기에 명시해야 돼
        NanumSquareExtraBold: ["NanumSquareExtraBold", "sans-serif"],
		BnviitLasik: ["BnviitLasik", "sans-serif"],
        ONE_Mobile_POP: ["ONE_Mobile_POP", "sans-serif"],
        yang: ["yang", "sans-serif"],
        Recipekorea: ["Recipekorea", "sans-serif"],
        EliceDXNeolli: ["EliceDXNeolli", "sans-serif"],
        EliceDigital: ["EliceDigitalBaeum", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")],
};
