import React from "react";
import { OrderCard } from "./OrderCard";

const WaterBottleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width={16}
    height={16}
    fill="currentColor"
  >
    <path d="M348.379 192.121v-91.164c0-22.691-17.731-41.309-40.063-42.75V20.619C308.316 9.232 299.085 0 287.698 0h-63.395c-11.387 0-20.619 9.232-20.619 20.619v37.589c-22.333 1.442-40.063 20.059-40.063 42.75v91.164c0 9.555 6.509 17.568 15.326 19.907v49.355c-8.818 2.34-15.326 10.353-15.326 19.906v210.091c0 11.387 9.232 20.619 20.619 20.619h143.522c11.387 0 20.619-9.232 20.619-20.619V281.292c0-9.555-6.509-17.568-15.326-19.908v-49.355c8.817-2.34 15.324-10.353 15.324-19.908zM244.921 41.237h22.159v16.869h-22.159V41.237zm31.698 375.34c0 11.387-9.232 20.619-20.619 20.619s-20.619-9.232-20.619-20.619v-60.481c0-11.387 9.232-20.619 20.619-20.619s20.619 9.232 20.619 20.619v60.481zm15.197-155.903h-71.632v-47.933h71.632v47.933z" />
  </svg>
);

const BikeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-bike size-4"
    aria-hidden="true"
  >
    <circle cx="18.5" cy="17.5" r="3.5"></circle>
    <circle cx="5.5" cy="17.5" r="3.5"></circle>
    <circle cx="15" cy="5" r="1"></circle>
    <path d="M12 17.5V14l-3-3 4-3 2 3h2"></path>
  </svg>
);

const BikePumpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="500.142 557.916 15.71 31.16"
    width={16}
    height={16}
    fill="currentColor"
  >
    <path d="M509.15 560.44h4.416c.405 0 .734-.544.734-1.212 0-.669-.33-1.212-.734-1.212h-11.04c-.404 0-.733.543-.733 1.212 0 .668.329 1.212.733 1.212h4.417zm-1.031 10.832a1.844 1.844 0 00-1.839 1.844v13.968c0 1.017.825 1.845 1.84 1.845a1.844 1.844 0 001.839-1.845v-13.968a1.844 1.844 0 00-1.84-1.844zm-.88-10.9h1.834v12.506h-1.834zm2.126 28.602h5.477c.502 0 .91-.264.91-.59 0-.324-.408-.588-.91-.588h-13.69c-.502 0-.91.264-.91.589 0 .325.408.589.91.589h5.477z" />
  </svg>
);

export function IntroDiagram() {
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
        <div className="w-full">
          <div className="flex items-center" style={{ transform: "rotate(-15deg)" }}>
            <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-blue-800"></div>
          </div>
        </div>
        <div className="w-full mt-24">
          <div className="flex items-center" style={{ transform: "rotate(15deg)" }}>
            <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-blue-800"></div>
          </div>
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
