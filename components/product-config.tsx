import { LogoIcon as OpenFrontIcon } from "./LogoIcon-openfront";
import { LogoIcon as OpenShipIcon } from "./LogoIcon";
import { OpensupportLogoIcon as OpenSupportIcon } from "./OpensupportLogoIcon";
import { Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

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
  href: string;
}

// Ethos/OpenSupport config
export const ethosCards: VerticalConfig[] = [
  {
    id: "opensupport",
    name: "Ethos",
    icon: (
      <div className={cn(spaceGrotesk.className)}>
        <div className="flex items-center gap-1 sm:gap-2 text-gray-900">
          <OpenSupportIcon className="size-3 sm:size-5 text-purple-500" />
          <h1 className="mb-0.5 text-xs sm:text-lg font-semibold tracking-tight">
            open<span className="font-normal">support</span>
          </h1>
        </div>
      </div>
    ),
    shortDescription: "Our philosophy and approach to building open-source commerce platforms",
    meta: "Philosophy",
    status: "Live",
    starCount: 0,
    tooltips: {
      graphql: "Learn about our open-source philosophy and development approach",
      storefront: "Understand our commitment to merchant independence and platform ownership",
      dashboard: "Explore our values of transparency, customization, and community-driven development",
    },
    href: "/docs/openfront/ethos",
  },
];

// Openship config
export const openshipCards: VerticalConfig[] = [
  {
    id: "openship-ecommerce",
    name: "E-commerce",
    icon: (
      <div className={cn(spaceGrotesk.className)}>
        <div className="flex items-center gap-1 sm:gap-2 text-gray-900">
          <OpenShipIcon className="size-3 sm:size-5 text-amber-500" />
          <h1 className="mb-0.5 text-xs sm:text-lg font-semibold tracking-tight">
            open<span className="font-normal">ship</span>
          </h1>
        </div>
      </div>
    ),
    shortDescription: "Multi-channel order management with intelligent fulfillment routing",
    meta: "v3.0.0",
    status: "Stable",
    starCount: 1069,
    tooltips: {
      graphql: "Advanced GraphQL API for order management, product matching, and supplier integration",
      storefront: "Multi-platform integration with Shopify, WooCommerce, and custom e-commerce solutions", 
      dashboard: "Comprehensive fulfillment dashboard with real-time analytics and automated routing",
    },
    href: "/docs/openship/ecommerce",
  },
  {
    id: "openship-getting-started",
    name: "Getting Started",
    icon: (
      <div className={cn(spaceGrotesk.className)}>
        <div className="flex items-center gap-1 sm:gap-2 text-gray-900">
          <OpenShipIcon className="size-3 sm:size-5 text-cyan-500" />
          <h1 className="mb-0.5 text-xs sm:text-lg font-semibold tracking-tight">
            open<span className="font-normal">ship</span>
          </h1>
        </div>
      </div>
    ),
    shortDescription: "Quick setup guide to get Openship running in minutes",
    meta: "Guide",
    status: "Live",
    starCount: 1069,
    tooltips: {
      graphql: "API setup and configuration for order routing and fulfillment automation",
      storefront: "Connect your e-commerce platforms and configure shop integrations",
      dashboard: "Set up your fulfillment dashboard and configure automated workflows",
    },
    href: "/docs/openship/ecommerce/getting-started",
  },
  {
    id: "openship-api-reference",
    name: "API Reference",
    icon: (
      <div className={cn(spaceGrotesk.className)}>
        <div className="flex items-center gap-1 sm:gap-2 text-gray-900">
          <OpenShipIcon className="size-3 sm:size-5 text-blue-500" />
          <h1 className="mb-0.5 text-xs sm:text-lg font-semibold tracking-tight">
            open<span className="font-normal">ship</span>
          </h1>
        </div>
      </div>
    ),
    shortDescription: "Complete API documentation for Openship integration",
    meta: "Reference",
    status: "Live",
    starCount: 1069,
    tooltips: {
      graphql: "Complete GraphQL schema documentation with examples and mutations",
      storefront: "Frontend integration examples and SDK usage for e-commerce platforms",
      dashboard: "Admin API endpoints for order management and fulfillment configuration",
    },
    href: "/docs/openship/ecommerce/api-reference",
  },
];

// OpenFront config
export const openfrontCards: VerticalConfig[] = [
  {
    id: "openfront-ecommerce",
    name: "E-commerce",
    icon: (
      <div className={cn(spaceGrotesk.className)}>
        <div className="flex items-center gap-1 sm:gap-2 text-gray-900">
          <OpenFrontIcon className="size-3 sm:size-5 text-blue-500" />
          <h1 className="mb-0.5 text-xs sm:text-lg font-semibold tracking-tight">
            open<span className="font-normal">front</span>
          </h1>
        </div>
      </div>
    ),
    shortDescription: "Complete e-commerce platform with multi-region support and GraphQL API",
    meta: "v1.0.0",
    status: "Stable",
    starCount: 38,
    tooltips: {
      graphql: "Build custom dashboards and storefronts using the API",
      storefront: "Multi-region e-commerce platform that allows you to sell anywhere",
      dashboard: "Manage your orders, inventory, customers, and sales channels",
    },
    href: "/docs/openfront/ecommerce",
  },
  {
    id: "openfront-restaurant",
    name: "Restaurant",
    icon: (
      <div className={cn(spaceGrotesk.className)}>
        <div className="flex items-center gap-1 sm:gap-2 text-gray-900">
          <OpenFrontIcon className="size-3 sm:size-5 text-amber-500" />
          <h1 className="mb-0.5 text-xs sm:text-lg font-semibold tracking-tight">
            open<span className="font-normal">front</span>
          </h1>
        </div>
      </div>
    ),
    shortDescription: "Food delivery and kitchen management platform built for restaurants",
    meta: "v0.0.0",
    status: "α",
    starCount: 0,
    tooltips: {
      graphql: "Build custom dashboards and storefronts using the API",
      storefront: "Restaurant menus with real-time ordering and table booking",
      dashboard: "Restaurant management with orders, kitchen display, and staff coordination",
    },
    href: "/docs/openfront/restaurant",
  },
  {
    id: "openfront-grocery",
    name: "Grocery",
    icon: (
      <div className={cn(spaceGrotesk.className)}>
        <div className="flex items-center gap-1 sm:gap-2 text-gray-900">
          <OpenFrontIcon className="size-3 sm:size-5 text-green-500" />
          <h1 className="mb-0.5 text-xs sm:text-lg font-semibold tracking-tight">
            open<span className="font-normal">front</span>
          </h1>
        </div>
      </div>
    ),
    shortDescription: "Fresh market delivery with real-time inventory for grocery stores",
    meta: "v0.0.0",
    status: "α",
    starCount: 0,
    tooltips: {
      graphql: "Build custom dashboards and storefronts using the API",
      storefront: "Grocery shopping with fresh inventory tracking and delivery slots",
      dashboard: "Grocery management with supplier networks and delivery routing",
    },
    href: "/docs/openfront/grocery",
  },
  {
    id: "openfront-gym",
    name: "Gym",
    icon: (
      <div className={cn(spaceGrotesk.className)}>
        <div className="flex items-center gap-1 sm:gap-2 text-gray-900">
          <OpenFrontIcon className="size-3 sm:size-5 text-emerald-500" />
          <h1 className="mb-0.5 text-xs sm:text-lg font-semibold tracking-tight">
            open<span className="font-normal">front</span>
          </h1>
        </div>
      </div>
    ),
    shortDescription: "Membership management and class booking for fitness businesses",
    meta: "v0.0.0",
    status: "α",
    starCount: 0,
    tooltips: {
      graphql: "Build custom dashboards and storefronts using the API",
      storefront: "Class booking with membership portal and trainer profiles",
      dashboard: "Gym management with member tracking, equipment, and staff scheduling",
    },
    href: "/docs/openfront/gym",
  },
  {
    id: "openfront-hospital",
    name: "Hospital",
    icon: (
      <div className={cn(spaceGrotesk.className)}>
        <div className="flex items-center gap-1 sm:gap-2 text-gray-900">
          <OpenFrontIcon className="size-3 sm:size-5 text-pink-500" />
          <h1 className="mb-0.5 text-xs sm:text-lg font-semibold tracking-tight">
            open<span className="font-normal">front</span>
          </h1>
        </div>
      </div>
    ),
    shortDescription: "Patient scheduling and HIPAA-compliant healthcare platform",
    meta: "v0.0.0",
    status: "α",
    starCount: 0,
    tooltips: {
      graphql: "Build custom dashboards and storefronts using the API",
      storefront: "Patient portal with appointment scheduling and medical records",
      dashboard: "Hospital management with EMR integration and staff coordination",
    },
    href: "/docs/openfront/hospital",
  },
  {
    id: "openfront-hotel",
    name: "Hotel",
    icon: (
      <div className={cn(spaceGrotesk.className)}>
        <div className="flex items-center gap-1 sm:gap-2 text-gray-900">
          <OpenFrontIcon className="size-3 sm:size-5 text-fuchsia-500" />
          <h1 className="mb-0.5 text-xs sm:text-lg font-semibold tracking-tight">
            open<span className="font-normal">front</span>
          </h1>
        </div>
      </div>
    ),
    shortDescription: "Hotel booking and guest management platform you own",
    meta: "v0.0.0",
    status: "α",
    starCount: 0,
    tooltips: {
      graphql: "Build custom dashboards and storefronts using the API",
      storefront: "Room booking with availability calendar and guest portal",
      dashboard: "Hotel management with reservations, housekeeping, and guest services",
    },
    href: "/docs/openfront/hotel",
  },
  {
    id: "openfront-dealership",
    name: "Dealership",
    icon: (
      <div className={cn(spaceGrotesk.className)}>
        <div className="flex items-center gap-1 sm:gap-2 text-gray-900">
          <OpenFrontIcon className="size-3 sm:size-5 text-red-500" />
          <h1 className="mb-0.5 text-xs sm:text-lg font-semibold tracking-tight">
            open<span className="font-normal">front</span>
          </h1>
        </div>
      </div>
    ),
    shortDescription: "Vehicle marketplace with inventory and service scheduling",
    meta: "v0.0.0",
    status: "α",
    starCount: 0,
    tooltips: {
      graphql: "Build custom dashboards and storefronts using the API",
      storefront: "Vehicle showcase with detailed specs, financing, and test drive booking",
      dashboard: "Dealership management with inventory, sales tracking, and service appointments",
    },
    href: "/docs/openfront/dealership",
  },
];