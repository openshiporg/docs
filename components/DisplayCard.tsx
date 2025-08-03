"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  ShoppingCart,
  LayoutDashboard,
  Github,
  ArrowRight,
} from "lucide-react";

// Simple CSS-based tooltip component
function SimpleTooltip({
  children,
  content,
  side = "bottom",
}: {
  children: React.ReactNode;
  content: string;
  side?: "top" | "bottom" | "left" | "right";
}) {
  return (
    <div className="relative group">
      {children}
      <div
        className={cn(
          "absolute z-50 px-3 py-2 text-xs text-white bg-gray-900 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap max-w-48",
          side === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-1",
          side === "top" && "bottom-full left-1/2 -translate-x-1/2 mb-1",
          side === "left" && "right-full top-1/2 -translate-y-1/2 mr-1",
          side === "right" && "left-full top-1/2 -translate-y-1/2 ml-1"
        )}
      >
        {content}
        <div
          className={cn(
            "absolute w-1 h-1 bg-gray-900 rotate-45",
            side === "bottom" && "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
            side === "top" && "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
            side === "left" && "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
            side === "right" && "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
          )}
        />
      </div>
    </div>
  );
}

export interface VerticalConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  shortDescription: string;
  meta: string;
  status: string;
  starCount: number;
  tooltips: {
    graphql: string;
    storefront: string;
    dashboard: string;
  };
}

function DisplayCard({
  className,
  icon,
  title = "Featured",
  description = "Discover amazing content",
  meta = "v1.0.0",
  status = "Live",
  starCount = 0,
  tooltips,
  showTooltips = false,
  href,
}: {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  meta?: string;
  status?: string;
  starCount?: number;
  tooltips?: {
    graphql?: string;
    storefront?: string;
    dashboard?: string;
  };
  showTooltips?: boolean;
  href?: string;
}) {
  const isComingSoon =
    status === "α" || status === "Alpha" || status === "Coming Soon";

  const CardContent = () => (
    <div
      className={cn(
        "group relative p-1 rounded-xl overflow-hidden transition-all duration-300 flex-shrink-0 w-full",
        "shadow-black-950/10 bg-zinc-100 border",
        "border-gray-300 dark:border-gray-800 ring-2 ring-gray-300/50 dark:ring-gray-700/50",
        "hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.03)]",
        "hover:-translate-y-0.5 will-change-transform cursor-pointer",
        className
      )}
    >
      <div className="relative flex flex-col">
        <div className="space-y-2 ring-foreground/5 text-card-foreground rounded-lg bg-card border shadow border-transparent ring-1 p-1.5 sm:p-2">
          <div className="flex items-start justify-between">
            <h3 className="flex items-center font-medium text-gray-900 dark:text-gray-100 tracking-tight text-sm sm:text-[15px]">
              <div className="flex flex-col">
                {icon}
                <span className="ml-3 sm:ml-7 -mt-1 text-[6px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  {title}
                </span>
              </div>
            </h3>
            <a
              href="https://github.com/openshiporg/openfront"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <Github className="size-3 sm:size-4 mr-1 sm:mr-1.5" />
              {starCount > 0 && starCount}
            </a>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-[425]">
            {isComingSoon
              ? `${description} - Coming soon to the platform`
              : description}
          </p>
        </div>

        {tooltips && showTooltips && (
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-0.5">
              <SimpleTooltip
                content={tooltips.storefront || "Storefront"}
                side="bottom"
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full size-5 text-xs bg-blue-500/15 text-blue-800 border border-blue-600/20",
                    isComingSoon ? "opacity-50" : "cursor-help"
                  )}
                >
                  <ShoppingCart className="size-3" strokeWidth={2} />
                </span>
              </SimpleTooltip>

              <SimpleTooltip
                content={tooltips.dashboard || "Dashboard"}
                side="bottom"
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full size-5 text-xs bg-lime-500/15 text-lime-800 border border-lime-600/20",
                    isComingSoon ? "opacity-50" : "cursor-help"
                  )}
                >
                  <LayoutDashboard className="size-3.5" />
                </span>
              </SimpleTooltip>

              <SimpleTooltip
                content={tooltips.graphql || "GraphQL API"}
                side="bottom"
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full size-5 text-xs bg-fuchsia-500/15 text-fuchsia-800 border border-fuchsia-600/20",
                    isComingSoon ? "opacity-50" : "cursor-help"
                  )}
                >
                  <svg
                    width="12"
                    height="12"
                    stroke="1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.125 6.45c0-.224.12-.431.315-.542l6.25-3.572a.625.625 0 0 1 .62 0l6.25 3.572a.625.625 0 0 1 .315.542v7.099c0 .224-.12.431-.315.542l-6.25 3.572a.625.625 0 0 1-.62 0L3.44 14.09a.625.625 0 0 1-.315-.542V6.45ZM1.25 13.55a2.5 2.5 0 0 0 1.26 2.17l6.25 3.572a2.5 2.5 0 0 0 2.48 0l6.25-3.572a2.5 2.5 0 0 0 1.26-2.17V6.45a2.5 2.5 0 0 0-1.26-2.17L11.24.708a2.5 2.5 0 0 0-2.48 0L2.51 4.28a2.5 2.5 0 0 0-1.26 2.17v7.099Z"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="m10 .338-8.522 14.35h17.044L10 .337ZM4.772 12.812 10 4.01l5.228 8.802H4.772Z"
                    />
                  </svg>
                </span>
              </SimpleTooltip>
            </div>
            <a
              href={href || "#"}
              className={cn(
                "flex items-center gap-1 text-xs hover:underline",
                isComingSoon
                  ? "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              )}
            >
              {isComingSoon ? "Coming Soon" : "Learn More"}
              <ArrowRight className="size-3" />
            </a>
          </div>
        )}
      </div>

      <div className="absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );

  if (href && !showTooltips) {
    return (
      <a href={href} className="block">
        <CardContent />
      </a>
    );
  }

  return <CardContent />;
}

export { DisplayCard };