import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogoIcon as OpenfrontLogoIcon } from "@/components/LogoIcon-openfront";
import { LogoIcon as OpenshipLogoIcon } from "@/components/LogoIcon";
import { Globe } from "@/components/ui/globe";
import { Space_Grotesk } from "next/font/google";
import { CombinedLogo } from "@/components/CombinedLogo";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: ReactNode;
  className: string;
  background: ReactNode;
  Icon: ({ className }: { className?: string }) => ReactNode;
  description: string;
  href: string;
  cta: string;
}) => (
  <div
    className={cn(
      "group relative flex flex-col justify-between overflow-hidden rounded-lg border bg-background md:shadow-lg",
      className,
    )}
  >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
      <Icon className="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
      <h3 className={cn(spaceGrotesk.className, "text-xl font-semibold text-neutral-700 dark:text-neutral-300")}>
        {name}
      </h3>
      <p className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-xs font-bold uppercase tracking-widest text-transparent dark:from-white dark:to-slate-900/10">
        {description}
      </p>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <Button variant="ghost" asChild size="sm" className="pointer-events-auto opacity-60">
        <a href={href}>
          Documentation
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
    <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
  </div>
);

function GlobeDemo() {
  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden rounded-lg border bg-background px-40 pb-40 pt-8 md:pb-60 md:shadow-xl">
      <span className="flex flex-col items-center pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
              {/* <CombinedLogo /> */}

        Ethos
          <span className="text-lg font-normal max-w-md">
        Discover our mission to democratize commerce across every industry with open-source solutions.
      </span>
      </span>
    
      <Globe className="top-40" />
      <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="px-4 py-8 max-w-6xl mx-auto w-full">
      <GlobeDemo />
      <BentoGrid className="mt-8">
        <BentoCard
          name={
            <>
              <span className="font-semibold">open</span>
              <span className="font-normal">front</span>
            </>
          }
          className=""
          background={<div />}
          Icon={({ className }) => <OpenfrontLogoIcon className={className} color="#6366f1" />}
          description="E-COMMERCE"
          href="/docs/openfront/ecommerce"
          cta="Explore E-commerce"
        />
        
        <BentoCard
          name={
            <>
              <span className="font-semibold">open</span>
              <span className="font-normal">ship</span>
            </>
          }
          className=""
          background={<div />}
          Icon={({ className }) => <OpenshipLogoIcon className={className} />}
          description="E-COMMERCE"
          href="/docs/openship/ecommerce"
          cta="Explore E-commerce"
        />
        
        <BentoCard
          name={
            <>
              <span className="font-semibold">open</span>
              <span className="font-normal">front</span>
            </>
          }
          className=""
          background={<div />}
          Icon={({ className }) => <OpenfrontLogoIcon className={className} color="#f59e0b" />}
          description="RESTAURANT"
          href="/docs/openfront/restaurant"
          cta="Explore Restaurant"
        />
        
        <BentoCard
          name={
            <>
              <span className="font-semibold">open</span>
              <span className="font-normal">front</span>
            </>
          }
          className=""
          background={<div />}
          Icon={({ className }) => <OpenfrontLogoIcon className={className} color="#22c55e" />}
          description="GROCERY"
          href="/docs/openfront/grocery"
          cta="Explore Grocery"
        />
        
        <BentoCard
          name={
            <>
              <span className="font-semibold">open</span>
              <span className="font-normal">front</span>
            </>
          }
          className=""
          background={<div />}
          Icon={({ className }) => <OpenfrontLogoIcon className={className} color="#ec4899" />}
          description="HOTEL"
          href="/docs/openfront/hotel"
          cta="Explore Hotel"
        />
        
        <BentoCard
          name={
            <>
              <span className="font-semibold">open</span>
              <span className="font-normal">front</span>
            </>
          }
          className=""
          background={<div />}
          Icon={({ className }) => <OpenfrontLogoIcon className={className} color="#ef4444" />}
          description="DEALERSHIP"
          href="/docs/openfront/dealership"
          cta="Explore Dealership"
        />
        
        <BentoCard
          name={
            <>
              <span className="font-semibold">open</span>
              <span className="font-normal">front</span>
            </>
          }
          className=""
          background={<div />}
          Icon={({ className }) => <OpenfrontLogoIcon className={className} color="#06b6d4" />}
          description="HOSPITAL"
          href="/docs/openfront/hospital"
          cta="Explore Hospital"
        />
        
        <BentoCard
          name={
            <>
              <span className="font-semibold">open</span>
              <span className="font-normal">front</span>
            </>
          }
          className=""
          background={<div />}
          Icon={({ className }) => <OpenfrontLogoIcon className={className} color="#d946ef" />}
          description="GYM"
          href="/docs/openfront/gym"
          cta="Explore Gym"
        />
        
      </BentoGrid>
    </main>
  );
}