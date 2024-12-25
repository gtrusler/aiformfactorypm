/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/globals.css",
  ],
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        mb: "1090px",
      },
      fontSize: {
        "2xs": ["10px", "16px"],
      },
      spacing: {
        "4xs": "4px",
        "3xs": "8px",
        "2xs": "12px",
        xs: "16px",
        s: "24px",
        md: "32px",
        xl: "48px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xs": "4px",
        xs: "8px",
        pill: 500,
        none: 0,
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        content: {
          brand: "#3E00FA",
          "on-brand": "#FFFFFF",
          disabled: "#0000004D",
          secondary: "#64748B",
          invert: "#FFFFFF",
          "invert-secondary": "#FFFFFFBF",
          "invert-disabled": "#FFFFFF66",
          error: "#EF4444",
          "on-error": "#FEF2F2",
          warning: "#EAB308",
          "on-warning": "#713F12",
          success: "#10B981",
          "on-success": "#ECFDF5",
          info: "#3B82F6",
          "on-info": "#EFF6FF",
        },
        surface: {
          "brand-subdued": "#F8FAFC",
          "on-brand-hover": "#FFFFFF1A",
          "on-brand-press": "#FFFFFF33",
          "brand-hover": "#3E00FA0D",
          "brand-press": "#3E00FA1A",
          press: "#0000000D",
          hover: "#00000008",
          disabled: "#F1F5F9",
          invert: "#020617",
          "invert-secondary": "#1E293B",
          "invert-disabled": "#334155",
          "invert-hover": "#FFFFFF26",
          "invert-press": "#FFFFFF40",
          error: "#EF4444",
          "error-subdued": "#FEF2F2",
          "on-error-hover": "#00000026",
          "on-error-press": "#00000040",
          "error-hover": "#EF44441A",
          "error-press": "#EF444426",
          warning: "#EAB308",
          "warning-subdued": "#FEFCE8",
          "on-warning-hover": "#FFFFFF33",
          "on-warning-press": "#FFFFFF59",
          "warning-hover": "#EAB30826",
          "warning-press": "#EAB3084D",
          success: "#10B981",
          "success-subdued": "#ECFDF5",
          "on-success-hover": "#00000026",
          "on-success-press": "#00000040",
          "success-hover": "#10B9811A",
          "success-press": "#10B98126",
          info: "#3B82F6",
          "info-subdued": "#EFF6FF",
          "on-info-hover": "#00000026",
          "on-info-press": "#00000040",
          "info-hover": "#3B82F61A",
          "info-press": "#3B82F633",
          brand: "#3E00FA",
          background: "#FFFFFF",
          overlay: "#000000BF",
          "sidebar-background": "#212121",
          "docs-content-background": "#0F0F0F",
        }
      },
      boxShadow: {
        popover: "0px 4px 8px 0px rgba(190, 190, 190, 0.16)",
      },
      backgroundImage: {
        gradient:
          "linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        opacity: "opacity 0.25s ease-in-out",
        appearFromRight: "appearFromRight 300ms ease-in-out",
        wiggle: "wiggle 1.5s ease-in-out infinite",
        popup: "popup 0.25s ease-in-out",
        shimmer: "shimmer 3s ease-out infinite alternate",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        opacity: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        appearFromRight: {
          "0%": { opacity: 0.3, transform: "translate(15%, 0px);" },
          "100%": { opacity: 1, transform: "translate(0);" },
        },
        wiggle: {
          "0%, 20%, 80%, 100%": {
            transform: "rotate(0deg)",
          },
          "30%, 60%": {
            transform: "rotate(-2deg)",
          },
          "40%, 70%": {
            transform: "rotate(2deg)",
          },
          "45%": {
            transform: "rotate(-4deg)",
          },
          "55%": {
            transform: "rotate(4deg)",
          },
        },
        popup: {
          "0%": { transform: "scale(0.8)", opacity: 0.8 },
          "50%": { transform: "scale(1.1)", opacity: 1 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        shimmer: {
          "0%": { backgroundPosition: "0 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}
