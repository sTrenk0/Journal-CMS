import React, { useState, ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode; // This defines that children can be any valid React node
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  return (
    <div className="relative inline-block">
      {/* Element that triggers the tooltip */}
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className="cursor-pointer"
      >
        {children}
      </div>

      {/* Tooltip */}
      {isVisible && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-gray-800 text-white text-sm p-2 rounded shadow-lg">
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
