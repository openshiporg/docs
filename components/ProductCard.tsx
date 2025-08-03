"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { LogoIcon as OpenFrontIcon } from "./LogoIcon-openfront";
import { LogoIcon as OpenShipIcon } from "./LogoIcon";
import { OpensupportLogoIcon as OpenSupportIcon } from "./OpensupportLogoIcon";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

interface NoiseBackgroundProps {
  className?: string;
  theme?: "blue" | "amber" | "green" | "pink" | "red" | "cyan" | "fuchsia" | "emerald" | "purple";
}

const NoiseBackground: React.FC<NoiseBackgroundProps> = ({
  className = "",
  theme = "red",
}) => {
  const themeColors = {
    blue: {
      primary: "#1a56db",
      secondary: "#1e429f", 
      tertiary: "#0f2361",
      accent: "#0047ab"
    },
    amber: {
      primary: "#f59e0b",
      secondary: "#d97706",
      tertiary: "#92400e",
      accent: "#f59e0b"
    },
    green: {
      primary: "#10b981",
      secondary: "#059669",
      tertiary: "#047857",
      accent: "#10b981"
    },
    pink: {
      primary: "#ec4899",
      secondary: "#db2777",
      tertiary: "#be185d",
      accent: "#ec4899"
    },
    red: {
      primary: "#ef4444",
      secondary: "#dc2626",
      tertiary: "#b91c1c",
      accent: "#ef4444"
    },
    cyan: {
      primary: "#06b6d4",
      secondary: "#0891b2",
      tertiary: "#0e7490",
      accent: "#06b6d4"
    },
    fuchsia: {
      primary: "#d946ef",
      secondary: "#c026d3",
      tertiary: "#a21caf",
      accent: "#d946ef"
    },
    emerald: {
      primary: "#10b981",
      secondary: "#059669",
      tertiary: "#047857",
      accent: "#10b981"
    },
    purple: {
      primary: "#8b5cf6",
      secondary: "#7c3aed",
      tertiary: "#6d28d9",
      accent: "#8b5cf6"
    }
  };

  const colors = themeColors[theme];

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id={`noiseFilter-${theme}`} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="4"
              stitchTiles="stitch"
              seed="5"
            />
            <feColorMatrix type="saturate" values="0.1" />
          </filter>
          <radialGradient
            id={`themeGlow-${theme}`}
            cx="50%"
            cy="0%"
            r="100%"
            fx="50%"
            fy="0%"
          >
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.4" />
            <stop offset="25%" stopColor={colors.secondary} stopOpacity="0.2" />
            <stop offset="50%" stopColor={colors.tertiary} stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`themeLines-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.accent} stopOpacity="0" />
            <stop offset="50%" stopColor={colors.accent} stopOpacity="0.15" />
            <stop offset="100%" stopColor={colors.accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="#000000" />
        <rect
          width="100%"
          height="100%"
          filter={`url(#noiseFilter-${theme})`}
          opacity="0.4"
        />
        <rect width="100%" height="100%" fill={`url(#themeGlow-${theme})`} />
        <g opacity="0.2">
          <path
            d="M0,0 L100%,100%"
            stroke={`url(#themeLines-${theme})`}
            strokeWidth="150"
          />
          <path
            d="M100%,0 L0,100%"
            stroke={`url(#themeLines-${theme})`}
            strokeWidth="100"
          />
          <path
            d="M50%,0 L50%,100%"
            stroke={`url(#themeLines-${theme})`}
            strokeWidth="80"
          />
          <path
            d="M0,50% L100%,50%"
            stroke={`url(#themeLines-${theme})`}
            strokeWidth="60"
          />
        </g>
      </svg>
    </div>
  );
};

interface ProductCardProps {
  title: string;
  href: string;
  theme: "blue" | "amber" | "green" | "pink" | "red" | "cyan" | "fuchsia" | "emerald" | "purple";
  product: "openfront" | "openship" | "opensupport";
  className?: string;
}

export function ProductCard({ title, href, theme, product, className }: ProductCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const getIcon = () => {
    const iconColor = {
      blue: "text-blue-500",
      amber: "text-amber-500", 
      green: "text-green-500",
      pink: "text-pink-500",
      red: "text-red-500",
      cyan: "text-cyan-500",
      fuchsia: "text-fuchsia-500",
      emerald: "text-emerald-500",
      purple: "text-purple-500"
    }[theme];

    switch (product) {
      case "openfront":
        return <OpenFrontIcon className={`w-8 h-8 ${iconColor}`} />;
      case "openship":
        return <OpenShipIcon className={`w-8 h-8 ${iconColor}`} />;
      case "opensupport":
        return <OpenSupportIcon className={`w-8 h-8 ${iconColor}`} />;
      default:
        return <OpenFrontIcon className={`w-8 h-8 ${iconColor}`} />;
    }
  };

  return (
    <Link href={href} className={cn("block group h-full w-full", className)}>
      <div className="relative overflow-hidden rounded-xl bg-black h-full w-full transition-all duration-300 hover:scale-105">
        {/* Noise Background */}
        <div className="absolute inset-0 w-full h-full">
          <NoiseBackground theme={theme} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
          <div className={cn(
            "transition-all duration-1000 ease-out",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            {/* Glass Icon Container */}
            <div className="mx-auto mb-4 flex w-fit justify-center">
              <div className="rounded-2xl backdrop-blur-md bg-slate-800/20 border border-slate-600/30 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] p-3">
                <div className="flex items-center justify-center">
                  {getIcon()}
                </div>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-medium text-white">
              {title}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
}