'use client';

import { ChevronDownIcon, CheckIcon } from 'lucide-react';
import { LogoIcon as OpenfrontLogoIcon } from '@/components/LogoIcon-openfront';
import { LogoIcon as OpenshipLogoIcon } from '@/components/LogoIcon';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Space_Grotesk } from "next/font/google";
import { useState, useMemo } from 'react';

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

export function DocsSwitcher() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const options = [
    {
      url: '/docs/openfront/ecommerce',
      title: 'Openfront',
      description: 'Open-source e-commerce platform',
      icon: <OpenfrontLogoIcon className="w-5 h-5" color="#6366f1" />,
      color: '#6366f1'
    },
    {
      url: '/docs/openship/ecommerce',
      title: 'Openship',
      description: 'Multi-channel fulfillment platform',
      icon: <OpenshipLogoIcon className="w-5 h-5" color="#f59e0b" />,
      color: '#f59e0b'
    }
  ];

  const selected = useMemo(() => {
    const lookup = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    return options.findLast((item) => {
      if (item.url === '/docs/openfront/ecommerce') {
        return pathname.startsWith('/docs/openfront') && !pathname.startsWith('/docs/openship');
      } else if (item.url === '/docs/openship/ecommerce') {
        return pathname.startsWith('/docs/openship');
      } else {
        return pathname.startsWith(item.url);
      }
    });
  }, [options, pathname]);

  const onClick = () => {
    setOpen(false);
  };

  const trigger = selected ? (
    <div className="flex items-center gap-2">
      <div className={cn(spaceGrotesk.className)}>
        <div className="flex items-center gap-2 text-zinc-700 dark:text-white">
          <div className="size-5">
            {selected.icon}
          </div>
          <h1 className="mb-1 text-xl font-semibold tracking-tight">
            {selected.title === 'Openfront' ? (
              <>open<span className="font-normal">front</span></>
            ) : (
              <>open<span className="font-normal">ship</span></>
            )}
          </h1>
        </div>
      </div>
      <ChevronDownIcon className="size-4 text-muted-foreground" />
    </div>
  ) : null;

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity outline-none rounded-lg"
        type="button"
      >
        {trigger}
      </button>
      
      {open && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 z-50 min-w-64 overflow-hidden rounded-lg border bg-background p-1 shadow-lg">
            {options.map((item) => {
              const isActive = item === selected;
              return (
                <button
                  key={item.url}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(item.url);
                    onClick();
                  }}
                  className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-accent hover:text-accent-foreground cursor-pointer w-full text-left"
                >
                  <div className={cn(spaceGrotesk.className)}>
                    <div className="flex items-center gap-2 text-zinc-700 dark:text-white">
                      <div className="size-5">
                        {item.icon}
                      </div>
                      <h1 className="mb-1 text-xl font-semibold tracking-tight">
                        {item.title === 'Openfront' ? (
                          <>open<span className="font-normal">front</span></>
                        ) : (
                          <>open<span className="font-normal">ship</span></>
                        )}
                      </h1>
                    </div>
                  </div>
                  <CheckIcon 
                    className={cn(
                      'ms-auto size-3.5 text-primary', 
                      !isActive && 'invisible'
                    )} 
                  />
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}