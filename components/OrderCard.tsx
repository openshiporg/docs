import React from "react";

interface LineItem {
  name: string;
  sku: string;
  color: string;
  icon: React.ReactNode;
}

interface OrderCardProps {
  title: string;
  order: string;
  lineItems: LineItem[];
  color: string;
}

const colorMap = {
  green: "text-green-800",
  blue: "text-blue-800",
  orange: "text-orange-800",
  violet: "text-violet-800",
  cyan: "text-cyan-800",
  red: "text-red-800",
};

const bgColorMap = {
  orange: "bg-orange-500/15",
  violet: "bg-violet-500/15", 
  cyan: "bg-cyan-500/15",
  red: "bg-red-500/15",
  blue: "bg-blue-500/15",
  green: "bg-green-500/15",
};

export function OrderCard({ title, order, lineItems, color }: OrderCardProps) {
  return (
    <div className="group relative p-1 rounded-xl overflow-hidden transition-all duration-300 flex-shrink-0 w-[12rem] shadow-inner bg-muted border border-border hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.03)] hover:-translate-y-0.5 will-change-transform cursor-pointer">
      <div className="relative flex flex-col">
        <div className="flex items-center justify-between px-2 py-1 mb-1">
          <span className="flex flex-col text-sm text-foreground">
            {title}
            <span className="text-xs text-muted-foreground">#{order}</span>
          </span>
        </div>
        <div className="space-y-1">
          {lineItems.map(({ name, sku, icon, color: itemColor }) => (
            <div key={name} className="text-card-foreground rounded-lg bg-card border shadow border-transparent ring-1 ring-foreground/5 p-1">
              <div className="flex items-center gap-2">
                <div>
                  <div className={`flex items-center justify-center rounded-md size-8 text-xs ${bgColorMap[itemColor as keyof typeof bgColorMap]} ${colorMap[itemColor as keyof typeof colorMap]} border ${itemColor === 'blue' ? 'border-blue-600/20' : itemColor === 'orange' ? 'border-orange-600/20' : itemColor === 'violet' ? 'border-violet-600/20' : itemColor === 'cyan' ? 'border-cyan-600/20' : itemColor === 'red' ? 'border-red-600/20' : 'border-green-600/20'}`}>
                    {icon}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[.8rem] text-card-foreground font-medium leading-tight">{name}</span>
                  <span className="text-[.7rem] text-muted-foreground leading-tight">SKU: {sku}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}