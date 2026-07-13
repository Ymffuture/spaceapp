import React from "react";

const AnimatedVisionLogo = ({
  size = 64,
  color = "#1E90FF",
  speed = 2 // seconds per full rotation
}) => {
  const dashArray = 2 * Math.PI * 30;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
    >
      <style>{`
        .circle-track {
          fill: none;
          stroke: ${color};
          stroke-width: 2;
          opacity: 0.15;
        }

        .circle-spinner {
          fill: none;
          stroke: ${color};
          stroke-width: 4;
          stroke-linecap: round;
          stroke-dasharray: ${dashArray};
          transform-origin: center;
          animation: 
            spin ${speed}s linear infinite,
            dash ${speed * 0.75}s ease-in-out infinite;
        }

        .vision-path {
          animation: pulse 2s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes dash {
          0% {
            stroke-dashoffset: ${dashArray};
          }
          50% {
            stroke-dashoffset: ${dashArray * 0.25};
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
            opacity: 0.7;
          }
        }
      `}</style>

      {/* Background track circle */}
      <circle
        cx="32"
        cy="32"
        r="30"
        className="circle-track"
      />

      {/* Spinning circle with dash animation */}
      <circle
        cx="32"
        cy="32"
        r="30"
        className="circle-spinner"
      />

      {/* Eye-like vision path */}
      <path
        d="M32 20a12 12 0 1 1 0 24m0 0l6 6"
        stroke={color}
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        className="vision-path"
      />
    </svg>
  );
};

export default AnimatedVisionLogo;
