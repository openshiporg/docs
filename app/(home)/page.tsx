import { CanvasRevealEffect } from "@/components/CanvasRevealEffect";

export default function HomePage() {
  return (
    <main className="px-4 py-8 max-w-5xl mx-auto">
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <a href="#" className="group relative isolate h-80 overflow-hidden rounded-2xl border border-border transition-transform duration-300 hover:-translate-y-0.5 col-span-3">
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-primary to-transparent"></div>
          <CanvasRevealEffect
            animationSpeed={0.4}
            containerClassName="absolute inset-0 -z-20 size-full rounded-2xl"
            colors={[[125, 211, 252]]}
            dotSize={2}
          />
          <div className="flex h-full flex-col justify-between p-10">
            <span className="flex size-12 items-center justify-center rounded-xl border border-background/20 bg-background/15 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building2 lucide-building-2 size-5 text-background" aria-hidden="true">
                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
                <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
                <path d="M10 6h4"></path>
                <path d="M10 10h4"></path>
                <path d="M10 14h4"></path>
                <path d="M10 18h4"></path>
              </svg>
            </span>
            <div>
              <h3 className="font-medium text-background">Sustainable Design</h3>
              <p className="mt-2 text-background/70">Create eco-friendly spaces that blend innovation with environmental responsibility. Utilizing renewable materials and energy-efficient solutions for tomorrow's world.</p>
            </div>
          </div>
        </a>

        <a href="#" className="group relative isolate h-80 overflow-hidden rounded-2xl border border-border transition-transform duration-300 hover:-translate-y-0.5 lg:col-span-1">
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-primary to-transparent"></div>
          <CanvasRevealEffect
            animationSpeed={0.6}
            containerClassName="absolute inset-0 -z-20 size-full rounded-2xl"
            colors={[[239, 68, 68]]}
            dotSize={3}
          />
          <div className="flex h-full flex-col justify-between p-10">
            <span className="flex size-12 items-center justify-center rounded-xl border border-background/20 bg-background/15 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-compass size-5 text-background" aria-hidden="true">
                <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </span>
            <div>
              <h3 className="font-medium text-background">BIM Solutions</h3>
              <p className="mt-2 text-background/70">From concept to construction, leverage advanced modeling tools and AI-driven analytics for precise and efficient project delivery.</p>
            </div>
          </div>
        </a>
          <a href="#" className="group relative isolate h-80 overflow-hidden rounded-2xl border border-border transition-transform duration-300 hover:-translate-y-0.5 lg:col-span-1">
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-primary to-transparent"></div>
          <CanvasRevealEffect
            animationSpeed={0.6}
            containerClassName="absolute inset-0 -z-20 size-full rounded-2xl"
            colors={[[239, 68, 68]]}
            dotSize={3}
          />
          <div className="flex h-full flex-col justify-between p-10">
            <span className="flex size-12 items-center justify-center rounded-xl border border-background/20 bg-background/15 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-compass size-5 text-background" aria-hidden="true">
                <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </span>
            <div>
              <h3 className="font-medium text-background">BIM Solutions</h3>
              <p className="mt-2 text-background/70">From concept to construction, leverage advanced modeling tools and AI-driven analytics for precise and efficient project delivery.</p>
            </div>
          </div>
        </a>
         <a href="#" className="group relative isolate h-80 overflow-hidden rounded-2xl border border-border transition-transform duration-300 hover:-translate-y-0.5 lg:col-span-1">
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-primary to-transparent"></div>
          <CanvasRevealEffect
            animationSpeed={0.6}
            containerClassName="absolute inset-0 -z-20 size-full rounded-2xl"
            colors={[[239, 68, 68]]}
            dotSize={3}
          />
          <div className="flex h-full flex-col justify-between p-10">
            <span className="flex size-12 items-center justify-center rounded-xl border border-background/20 bg-background/15 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-compass size-5 text-background" aria-hidden="true">
                <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </span>
            <div>
              <h3 className="font-medium text-background">BIM Solutions</h3>
              <p className="mt-2 text-background/70">From concept to construction, leverage advanced modeling tools and AI-driven analytics for precise and efficient project delivery.</p>
            </div>
          </div>
        </a>
                <a href="#" className="group relative isolate h-80 overflow-hidden rounded-2xl border border-border transition-transform duration-300 hover:-translate-y-0.5 lg:col-span-1">
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-primary to-transparent"></div>
          <CanvasRevealEffect
            animationSpeed={0.6}
            containerClassName="absolute inset-0 -z-20 size-full rounded-2xl"
            colors={[[239, 68, 68]]}
            dotSize={3}
          />
          <div className="flex h-full flex-col justify-between p-10">
            <span className="flex size-12 items-center justify-center rounded-xl border border-background/20 bg-background/15 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-compass size-5 text-background" aria-hidden="true">
                <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </span>
            <div>
              <h3 className="font-medium text-background">BIM Solutions</h3>
              <p className="mt-2 text-background/70">From concept to construction, leverage advanced modeling tools and AI-driven analytics for precise and efficient project delivery.</p>
            </div>
          </div>
        </a>
          <a href="#" className="group relative isolate h-80 overflow-hidden rounded-2xl border border-border transition-transform duration-300 hover:-translate-y-0.5 lg:col-span-1">
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-primary to-transparent"></div>
          <CanvasRevealEffect
            animationSpeed={0.6}
            containerClassName="absolute inset-0 -z-20 size-full rounded-2xl"
            colors={[[239, 68, 68]]}
            dotSize={3}
          />
          <div className="flex h-full flex-col justify-between p-10">
            <span className="flex size-12 items-center justify-center rounded-xl border border-background/20 bg-background/15 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-compass size-5 text-background" aria-hidden="true">
                <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </span>
            <div>
              <h3 className="font-medium text-background">BIM Solutions</h3>
              <p className="mt-2 text-background/70">From concept to construction, leverage advanced modeling tools and AI-driven analytics for precise and efficient project delivery.</p>
            </div>
          </div>
        </a>
         <a href="#" className="group relative isolate h-80 overflow-hidden rounded-2xl border border-border transition-transform duration-300 hover:-translate-y-0.5 lg:col-span-1">
          <div className="absolute inset-0 -z-10 bg-linear-to-t from-primary to-transparent"></div>
          <CanvasRevealEffect
            animationSpeed={0.6}
            containerClassName="absolute inset-0 -z-20 size-full rounded-2xl"
            colors={[[239, 68, 68]]}
            dotSize={3}
          />
          <div className="flex h-full flex-col justify-between p-10">
            <span className="flex size-12 items-center justify-center rounded-xl border border-background/20 bg-background/15 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-compass size-5 text-background" aria-hidden="true">
                <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </span>
            <div>
              <h3 className="font-medium text-background">BIM Solutions</h3>
              <p className="mt-2 text-background/70">From concept to construction, leverage advanced modeling tools and AI-driven analytics for precise and efficient project delivery.</p>
            </div>
          </div>
        </a>
      </div>
    </main>
  );
}
