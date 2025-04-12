import * as React from "react";
const Love = ({ size = 48, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    data-supported-dps={`${size}x${size}`}
    className={className}
    viewBox="0 0 48 48"
    {...props}
  >
    <circle cx={24} cy={24} r={24} fill="none" />
    <circle cx={24} cy={24} r={22} fill="#df704d" />
    <path
      fill="#fff3f0"
      fillRule="evenodd"
      stroke="#77280c"
      d="M23.08 14.6a8.21 8.21 0 0 0-11.66 0 8.35 8.35 0 0 0 0 11.76L24 39l12.58-12.64a8.35 8.35 0 0 0 0-11.75 8.13 8.13 0 0 0-11.63 0l-.94.9z"
    />
    <path
      fill="none"
      d="M34.79 15.14a6.68 6.68 0 0 1 1.66 2c2.83 5.25-1.9 8.52-4.84 11.51-1.91 1.93-3.83 3.85-5.82 5.68M17 14a6.69 6.69 0 0 0-2.39.34 5.69 5.69 0 0 0-3 2.57 7.85 7.85 0 0 0-1 3.91v.29"
    />
    <path
      fill="none"
      stroke="#77280c"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M23.08 14.44a8.18 8.18 0 0 0-11.66 0 8.35 8.35 0 0 0 0 11.76L24 38.83 36.58 26.2a8.37 8.37 0 0 0 0-11.76 8.11 8.11 0 0 0-11.62 0l-.94.9z"
    />
    <path
      fill="#77280c"
      fillRule="evenodd"
      d="M23 15.71a9.93 9.93 0 0 1 .84 1.2 1 1 0 0 0 1.72-1 13 13 0 0 0-1.15-1.6 1 1 0 0 0-1.76.39 1 1 0 0 0 .35 1.01z"
    />
  </svg>
);
export default Love;
