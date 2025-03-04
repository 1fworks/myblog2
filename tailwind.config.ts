import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        "stair-animation": "stair-kf 300ms ease forwards",
        "climb70-animation": "climb70-kf 300ms ease forwards",
        "climb100-animation": "climb100-kf 300ms ease forwards",
        "shimmer-animation": "shimmer-kf 1s infinite ease-in-out",
      },
      keyframes: {
        "climb100-kf": {
          from: {
            transform: "translateY(2.5rem);",
            opacity: "0%;",
          },
          to: {
            transform: "translateY(0);",
            opacity: "100%;",
          }
        },
        "climb70-kf": {
          from: {
            transform: "translateY(2.5rem);",
            opacity: "0%;",
          },
          to: {
            transform: "translateY(0);",
            opacity: "70%;",
          }
        },
        "stair-kf": {
          from: {
            transform: "translateX(-2.5rem);",
            opacity: "0%;",
          },
          to: {
            transform: "translateX(0);",
            opacity: "100%;",
          }
        },
        "shimmer-kf": {
          '0%': {
            'background-position': '200% 0;',
          },
          '100%': {
            'background-position': '0% 0;',
          }
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;
