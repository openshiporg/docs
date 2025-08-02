import React from "react";

interface ConnectorProps {
  degrees?: number;
  icon?: React.ReactNode;
}

export function Connector({ degrees = 0, icon }: ConnectorProps) {
  return (
    <div className="flex items-center w-full" style={{ transform: `rotate(${degrees}deg)` }}>
      <div className="h-1 flex-1 bg-gradient-to-r from-green-500 to-green-800"></div>
      
      {icon && (
        <div 
          className="bg-blue-900 text-white border-2 border-gray-400 rounded-full w-8 h-8 flex items-center justify-center mx-2"
          style={{ transform: `rotate(${degrees * -1}deg)` }}
        >
          {icon}
        </div>
      )}
      
      <div className="h-1 flex-1 bg-gradient-to-r from-blue-800 to-blue-500"></div>
    </div>
  );
}