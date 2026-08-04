import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoIcon as OpenfrontLogoIcon } from "@/components/LogoIcon-openfront";
import { LogoIcon as OpenshipLogoIcon } from "@/components/LogoIcon";
import { Globe } from "@/components/ui/globe";
import { Space_Grotesk } from "next/font/google";
import openfrontProducts from "@/data/openfront-products.json";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

const featuredVerticalIds = new Set([
  "ecommerce",
  "restaurant",
  "grocery",
  "hotel",
  "dealership",
  "hospital",
  "gym",
]);

const additionalOpenfrontVerticals = openfrontProducts.filter(
  (product) => !featuredVerticalIds.has(product.id)
);

const OpenfrontWordmark = () => (
  <>
    <span className="font-semibold">open</span>
    <span className="font-normal">front</span>
  </>
);

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "grid w-full auto-rows-[22rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
      className
    )}
  >
    {children}
  </div>
);

const BentoCard = ({
  name,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: ReactNode;
  background: ReactNode;
  Icon: ({ className }: { className?: string }) => ReactNode;
  description: string;
  href: string;
  cta: string;
}) => (
  <a href={href} className="group block">
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-lg border bg-background transition-all duration-300 hover:scale-[1.02] hover:shadow-xl md:shadow-lg">
      <div>{background}</div>
      <div className="z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 md:group-hover:-translate-y-10">
        <div className="h-12 w-12 origin-left transform-gpu transition-all duration-300 ease-in-out md:group-hover:scale-75">
          <Icon className="size-full" />
        </div>
        <h3 className={cn(spaceGrotesk.className, "text-xl font-semibold text-neutral-700 dark:text-neutral-300")}>
          {name}
        </h3>
        <p className="bg-gradient-to-b from-black to-gray-400 bg-clip-text text-xs font-bold uppercase tracking-wider text-transparent dark:from-white dark:to-slate-500">
          {description}
        </p>

        <div className="mt-4 flex w-full flex-row items-center md:hidden">
          <span className="-ml-3 inline-flex h-8 items-center rounded-md px-3 text-sm font-medium opacity-60 transition-opacity group-hover:opacity-100">
            {cta}
            <ArrowRight className="ml-2 h-4 w-4" />
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 hidden w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 md:flex md:group-hover:translate-y-0 md:group-hover:opacity-100">
        <span className="inline-flex h-8 items-center rounded-md px-3 text-sm font-medium opacity-60 transition-opacity group-hover:opacity-100">
          {cta}
          <ArrowRight className="ml-2 h-4 w-4" />
        </span>
      </div>
      <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
    </div>
  </a>
);

function GlobeDemo() {
  return (
    <a href="/ethos" className="group block">
      <div className="relative flex size-full items-center justify-center overflow-hidden rounded-lg border bg-background px-6 pb-40 pt-8 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl md:px-40 md:pb-60 md:shadow-xl">
        <span className="pointer-events-none flex flex-col items-center bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-7xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-200/50 sm:text-8xl">
          Ethos
          <span className="max-w-md text-lg font-normal">
            Why Openfront and Openship are built around source, data, and relationship ownership
          </span>
        </span>
        <Globe className="top-40" />
        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(0,0,0,0))]" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-sky-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </a>
  );
}

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="sr-only">Openfront and Openship documentation</h1>
      <GlobeDemo />

      <h2 className="sr-only">Featured documentation</h2>
      <BentoGrid className="mt-8">
        <BentoCard
          name={
            <>
              <span className="font-semibold">open</span>
              <span className="font-normal">ship</span>
            </>
          }
          background={<div />}
          Icon={() => <OpenshipLogoIcon className="size-full" />}
          description="E-COMMERCE"
          href="/docs/openship/ecommerce"
          cta="Documentation"
        />

        <BentoCard
          name={<OpenfrontWordmark />}
          background={<div />}
          Icon={() => <OpenfrontLogoIcon className="size-full" color="#6366f1" />}
          description="E-COMMERCE"
          href="/docs/openfront/ecommerce"
          cta="Documentation"
        />

        <BentoCard
          name={<OpenfrontWordmark />}
          background={<div />}
          Icon={() => <OpenfrontLogoIcon className="size-full" color="#f59e0b" />}
          description="RESTAURANT"
          href="/docs/openfront/restaurant"
          cta="Documentation"
        />

        <BentoCard
          name={<OpenfrontWordmark />}
          background={<div />}
          Icon={() => <OpenfrontLogoIcon className="size-full" color="#10b981" />}
          description="GROCERY"
          href="/docs/openfront/grocery"
          cta="Documentation"
        />

        <BentoCard
          name={<OpenfrontWordmark />}
          background={<div />}
          Icon={() => <OpenfrontLogoIcon className="size-full" color="#ec4899" />}
          description="HOTEL"
          href="/docs/openfront/hotel"
          cta="Documentation"
        />

        <BentoCard
          name={<OpenfrontWordmark />}
          background={<div />}
          Icon={() => <OpenfrontLogoIcon className="size-full" color="#ef4444" />}
          description="DEALERSHIP"
          href="/docs/openfront/dealership"
          cta="Documentation"
        />

        <BentoCard
          name={<OpenfrontWordmark />}
          background={<div />}
          Icon={() => <OpenfrontLogoIcon className="size-full" color="#06b6d4" />}
          description="HOSPITAL"
          href="/docs/openfront/hospital"
          cta="Documentation"
        />

        <BentoCard
          name={<OpenfrontWordmark />}
          background={<div />}
          Icon={() => <OpenfrontLogoIcon className="size-full" color="#d946ef" />}
          description="GYM"
          href="/docs/openfront/gym"
          cta="Documentation"
        />

        {additionalOpenfrontVerticals.map((product) => (
          <BentoCard
            key={product.id}
            name={<OpenfrontWordmark />}
            background={<div />}
            Icon={() => <OpenfrontLogoIcon className="size-full" color={product.color} />}
            description={product.name.toUpperCase()}
            href={product.href}
            cta="Documentation"
          />
        ))}
      </BentoGrid>
    </main>
  );
}
