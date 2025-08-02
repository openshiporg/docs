import React from "react";
import { OrderCard } from "./OrderCard";
import { Connector } from "./Connector";

const BikeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg" 
    width={28} 
    height={28} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={2} 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="18.5" cy="17.5" r="3.5"/>
    <circle cx="5.5" cy="17.5" r="3.5"/>
    <circle cx="15" cy="5" r="1"/>
    <path d="m14 6.5 3 3V17"/>
    <path d="M6 15.5V17"/>
    <path d="M8.5 12L11 6l4.5 6"/>
    <path d="M9 18l4.5-6"/>
  </svg>
);

const TireIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 1200"
    width={28}
    fill="currentColor"
  >
    <g>
      <path d="M600.001 50C296.728 50 50 296.728 50 600.001 50 903.272 296.728 1150 600.001 1150 903.272 1150 1150 903.272 1150 600.001 1150 296.728 903.272 50 600.001 50zm0 1077.836c-291.049 0-527.837-236.785-527.837-527.834S308.952 72.164 600.001 72.164s527.834 236.788 527.834 527.837-236.785 527.835-527.834 527.835z" />
      <path d="M600.001 108.985c-270.746 0-491.016 220.27-491.016 491.016s220.27 491.013 491.016 491.013 491.013-220.267 491.013-491.013-220.267-491.016-491.013-491.016zm0 965.406c-261.582 0-474.393-212.811-474.393-474.39 0-261.582 212.811-474.393 474.393-474.393 261.579 0 474.39 212.811 474.39 474.393 0 261.58-212.81 474.39-474.39 474.39z" />
    </g>
  </svg>
);

const LinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 17H7A5 5 0 0 1 7 7h2"/>
    <path d="M15 7h2a5 5 0 1 1 0 10h-2"/>
    <line x1="11" y1="13" x2="13" y2="11"/>
  </svg>
);

export function LinkDiagram() {
  return (
    <div className="flex items-center justify-center gap-0 pt-12 pb-8 mx-auto max-w-2xl overflow-hidden">
      <OrderCard
        title="Bike Central"
        order="BC-24591"
        color="green"
        lineItems={[
          {
            name: "Road Bike",
            sku: "32432943",
            color: "blue",
            icon: <BikeIcon />,
          },
          {
            name: "Tires",
            sku: "93443781",
            color: "green",
            icon: <TireIcon />,
          },
        ]}
      />
      
      <div className="flex flex-col items-center flex-1 mx-4 mb-20">
        <div className="flex flex-col items-center gap-1 hidden md:flex">
          <span className="text-xs text-gray-500 bg-transparent">Link</span>
          <div className="border border-gray-300 bg-white rounded overflow-hidden">
            <div className="text-xs font-bold uppercase tracking-wider text-green-600 px-2 py-1 text-center">
              Bike Central
            </div>
            <div className="border-t border-dashed border-gray-300"></div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 px-2 py-1 text-center">
              Warehouse #1
            </div>
          </div>
        </div>
        
        <div className="w-full mt-2">
          <Connector icon={<LinkIcon />} />
        </div>
      </div>
      
      <OrderCard
        title="Warehouse #1"
        order="WH1-42352"
        color="blue"
        lineItems={[
          {
            name: "Road Bike",
            sku: "32432943",
            color: "blue",
            icon: <BikeIcon />,
          },
          {
            name: "Tires",
            sku: "93443781",
            color: "green",
            icon: <TireIcon />,
          },
        ]}
      />
    </div>
  );
}