import { LogoIcon as OpenFrontIcon } from "./LogoIcon-openfront";
import { LogoIcon as OpenshipIcon } from "./LogoIcon";
import { OpensupportLogoIcon as OpenSupportIcon } from "./OpensupportLogoIcon";
import { Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";
import openfrontProducts from "@/data/openfront-products.json";

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
  starCount: number;
  sourceHref?: string;
  tooltips: {
    graphql: string;
    storefront: string;
    dashboard: string;
  };
  href: string;
}

function Wordmark({ color, product = "openfront" }: { color: string; product?: "openfront" | "openship" }) {
  return (
    <div className={cn(spaceGrotesk.className)}>
      <div className="flex items-center gap-1 text-gray-900 sm:gap-2">
        {product === "openfront" ? (
          <OpenFrontIcon className="size-3 sm:size-5" color={color} />
        ) : (
          <span style={{ color }}><OpenshipIcon className="size-3 sm:size-5" /></span>
        )}
        <h1 className="mb-0.5 text-xs font-semibold tracking-tight sm:text-lg">
          open<span className="font-normal">{product === "openfront" ? "front" : "ship"}</span>
        </h1>
      </div>
    </div>
  );
}

export const ethosCards: VerticalConfig[] = [
  {
    id: "opensupport",
    name: "Ethos",
    icon: (
      <div className={cn(spaceGrotesk.className)}>
        <div className="flex items-center gap-1 text-gray-900 sm:gap-2">
          <OpenSupportIcon className="size-3 text-purple-500 sm:size-5" />
          <h1 className="mb-0.5 text-xs font-semibold tracking-tight sm:text-lg">
            open<span className="font-normal">support</span>
          </h1>
        </div>
      </div>
    ),
    shortDescription: "Why Openfront and Openship are built around source, data, and relationship ownership",
    meta: "Philosophy",
    starCount: 0,
    tooltips: {
      graphql: "Understand the API ownership boundary",
      storefront: "Understand merchant and customer relationship ownership",
      dashboard: "Understand operator control and platform independence",
    },
    href: "/ethos",
  },
];

export const openshipCards: VerticalConfig[] = [
  {
    id: "openship-ecommerce",
    name: "Order routing",
    icon: <Wordmark color="#f59e0b" product="openship" />,
    shortDescription: "Shop and channel adapters, product matching, order routing, and fulfillment coordination",
    meta: "Openship",
    starCount: 0,
    sourceHref: "https://github.com/openshiporg/openship",
    tooltips: {
      graphql: "Bounded GraphQL operations for shops, channels, matches, and orders",
      storefront: "Connect commerce sources through explicit shop and channel adapters",
      dashboard: "Operate product matches, routing, orders, and fulfillment exceptions",
    },
    href: "/docs/openship/ecommerce",
  },
  {
    id: "openship-getting-started",
    name: "Getting Started",
    icon: <Wordmark color="#06b6d4" product="openship" />,
    shortDescription: "Install Openship, configure PostgreSQL and sessions, apply migrations, and connect adapters",
    meta: "Guide",
    starCount: 0,
    sourceHref: "https://github.com/openshiporg/openship",
    tooltips: {
      graphql: "Configure the GraphQL application boundary",
      storefront: "Connect source shops and fulfillment channels",
      dashboard: "Start the operator dashboard with reviewed migrations",
    },
    href: "/docs/openship/ecommerce/getting-started",
  },
  {
    id: "openship-api-reference",
    name: "API Reference",
    icon: <Wordmark color="#3b82f6" product="openship" />,
    shortDescription: "Openship's current GraphQL operations and integration boundaries",
    meta: "Reference",
    starCount: 0,
    sourceHref: "https://github.com/openshiporg/openship",
    tooltips: {
      graphql: "Queries and mutations for current Openship workflows",
      storefront: "Adapter-facing operations and payload boundaries",
      dashboard: "Operator operations for routing and fulfillment",
    },
    href: "/docs/openship/ecommerce/api-reference",
  },
];

export const openfrontCards: VerticalConfig[] = openfrontProducts.map((product) => ({
  id: `openfront-${product.id}`,
  name: product.name,
  icon: <Wordmark color={product.color} />,
  shortDescription: product.description,
  meta: `${product.name} operations`,
  starCount: 0,
  sourceHref: product.sourceUrl ?? undefined,
  tooltips: {
    graphql: `Use ${product.name}'s bounded GraphQL operations instead of exposing private model CRUD`,
    storefront: `Customer-facing workflows: ${product.description}`,
    dashboard: `Operator workflows: ${product.description}`,
  },
  href: product.href,
}));
