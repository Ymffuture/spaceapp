import React from "react";

const AnimatedVisionLogo = ({
  size = 64,
  color = "#1E90FF",
  speed = 4 // animation duration in seconds
}) => {
  const dashArray = 2 * Math.PI * 30; // Circumference of r=30 (circle)
  const duration = `${speed}s`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
    >
      <style>{`
        .circle {
          stroke-dasharray: ${dashArray};
          stroke-dashoffset: ${dashArray};
          animation: circleSpin ${duration} ease-in-out infinite;
          transform: rotate(-90deg);
          transform-origin: center;
        }

        .vision-path {
          animation: pulse 2s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes circleSpin {
          0% {
            stroke-dashoffset: ${dashArray};
          }
          50% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: ${dashArray};
          }
        }

        @keyframes pulse {
          0%, 100% {
            stroke-width: 4;
            opacity: 1;
          }
          50% {
            stroke-width: 6;
            opacity: 0.6;
          }
        }
      `}</style>

      {/* Circle stroke animation */}
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="transparent"
        stroke={color}
        strokeWidth="4"
        className="circle"
      />

      {/* Eye-like vision path */}
      <path
        d="M32 20a12 12 0 1 1 0 24m0 0l6 6"
        stroke={color}
        fill="transparent"
        strokeWidth="4"
        strokeLinecap="round"
        className="vision-path"
      />
    </svg>
  );
};

export default AnimatedVisionLogo;

