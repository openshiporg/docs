import React from "react";
import { OrderCard } from "./OrderCard";
import { Connector } from "./Connector";

const WaterBottleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width={14}
    height={14}
    fill="currentColor"
  >
    <path d="M348.379 192.121v-91.164c0-22.691-17.731-41.309-40.063-42.75V20.619C308.316 9.232 299.085 0 287.698 0h-63.395c-11.387 0-20.619 9.232-20.619 20.619v37.589c-22.333 1.442-40.063 20.059-40.063 42.75v91.164c0 9.555 6.509 17.568 15.326 19.907v49.355c-8.818 2.34-15.326 10.353-15.326 19.906v210.091c0 11.387 9.232 20.619 20.619 20.619h143.522c11.387 0 20.619-9.232 20.619-20.619V281.292c0-9.555-6.509-17.568-15.326-19.908v-49.355c8.817-2.34 15.324-10.353 15.324-19.908zM244.921 41.237h22.159v16.869h-22.159V41.237zm31.698 375.34c0 11.387-9.232 20.619-20.619 20.619s-20.619-9.232-20.619-20.619v-60.481c0-11.387 9.232-20.619 20.619-20.619s20.619 9.232 20.619 20.619v60.481zm15.197-155.903h-71.632v-47.933h71.632v47.933z" />
  </svg>
);

const BikePumpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="500.142 557.916 15.71 31.16"
    width={10}
    height={10}
    fill="currentColor"
  >
    <path d="M509.15 560.44h4.416c.405 0 .734-.544.734-1.212 0-.669-.33-1.212-.734-1.212h-11.04c-.404 0-.733.543-.733 1.212 0 .668.329 1.212.733 1.212h4.417zm-1.031 10.832a1.844 1.844 0 00-1.839 1.844v13.968c0 1.017.825 1.845 1.84 1.845a1.844 1.844 0 001.839-1.845v-13.968a1.844 1.844 0 00-1.84-1.844zm-.88-10.9h1.834v12.506h-1.834zm2.126 28.602h5.477c.502 0 .91-.264.91-.59 0-.324-.408-.588-.91-.588h-13.69c-.502 0-.91.264-.91.589 0 .325.408.589.91.589h5.477z" />
  </svg>
);

const MatchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={11}
    height={11}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

export function MatchDiagram() {
  return (
    <div className="flex items-center justify-center gap-0 pt-12 pb-8 mx-auto max-w-2xl overflow-hidden">
      <OrderCard
        title="Bike Central"
        order="BC-24592"
        color="green"
        lineItems={[
          {
            name: "Water Bottle",
            sku: "52139803",
            color: "orange",
            icon: <WaterBottleIcon />,
          },
          {
            name: "Bike Pump",
            sku: "72384762",
            color: "violet",
            icon: <BikePumpIcon />,
          },
        ]}
      />
      
      <div className="flex flex-col items-center flex-1 mx-4">
        <div className="flex flex-col items-center gap-1 hidden md:flex">
          <span className="text-xs text-gray-500">Match</span>
          <div className="border border-gray-300 bg-white rounded flex w-14 h-6">
            <div className="bg-orange-100 flex items-center justify-center flex-1">
              <div className="text-orange-600">
                <WaterBottleIcon />
              </div>
            </div>
            <div className="bg-cyan-100 flex items-center justify-center flex-1">
              <div className="text-cyan-600">
                <WaterBottleIcon />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <Connector degrees={-15} icon={<MatchIcon />} />
        </div>
        
        <div className="w-full mt-16">
          <Connector degrees={15} icon={<MatchIcon />} />
        </div>
        
        <div className="flex flex-col items-center gap-1 hidden md:flex">
          <div className="border border-gray-300 bg-white rounded flex w-14 h-6">
            <div className="bg-violet-100 flex items-center justify-center flex-1">
              <div className="text-violet-600">
                <BikePumpIcon />
              </div>
            </div>
            <div className="bg-red-100 flex items-center justify-center flex-1">
              <div className="text-red-600">
                <BikePumpIcon />
              </div>
            </div>
          </div>
          <span className="text-xs text-gray-500">Match</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        <OrderCard
          title="Supplier #1"
          order="VB-30134"
          color="blue"
          lineItems={[
            {
              name: "Water Bottle",
              sku: "81310291",
              color: "cyan",
              icon: <WaterBottleIcon />,
            },
          ]}
        />
        
        <div className="h-4 sm:h-6"></div>
        
        <OrderCard
          title="Supplier #2"
          order="TS-72139"
          color="blue"
          lineItems={[
            {
              name: "Bike Pump",
              sku: "92346793",
              color: "red",
              icon: <BikePumpIcon />,
            },
          ]}
        />
      </div>
    </div>
  );
}