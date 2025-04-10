import * as React from "react";
const Insightful = ({ size = 48, className = "", ...props }) => (
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
    <circle cx={24} cy={24} r={22} fill="#f5bb5c" />
    <path
      fill="#ffe1b2"
      fillRule="evenodd"
      d="M26.58 41h-5a1.68 1.68 0 0 1-1.68-1.68v-4.2h8.4v4.2A1.69 1.69 0 0 1 26.58 41z"
    />
    <path
      fill="#fcf0de"
      fillRule="evenodd"
      d="M19.87 35.92v-.84a10 10 0 0 0-.48-3.08 10.08 10.08 0 0 0-1.62-2.51 10.23 10.23 0 0 1-3.77-7.8v-.05a10.08 10.08 0 1 1 20.16 0 10.55 10.55 0 0 1-4 8l-.13.11a3.75 3.75 0 0 0-.57.62 5.43 5.43 0 0 0-.72 1.47 10.05 10.05 0 0 0-.47 3.22v.84"
    />
    <path
      fill="none"
      stroke="#5d3b01"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m14 7.36 2.12 2.77M35 7.36l-2.12 2.77M24.06 4v4.2"
    />
    <path
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M22.3 13.86a7 7 0 0 0-3.84 2.08 7.85 7.85 0 0 0-2.14 3.8"
    />
    <path
      fill="none"
      d="M22.53 30.12a8 8 0 0 0 7-1.92 8.59 8.59 0 0 0-.45-13m-.82 14c-1 .68-1.54 3.05-1.54 5"
    />
    <path
      fill="none"
      stroke="#5d3b01"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M26.58 41h-5a1.68 1.68 0 0 1-1.68-1.68v-4.2h8.4v4.2A1.69 1.69 0 0 1 26.58 41z"
    />
    <path
      fill="none"
      stroke="#5d3b01"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19.86 35.92v-.84a10 10 0 0 0-.48-3.08 5.7 5.7 0 0 0-.82-1.49 8.06 8.06 0 0 0-1.16-1.31 11.05 11.05 0 0 1-1.17-1.2A10.53 10.53 0 0 1 14 21.66v-.05a10.08 10.08 0 1 1 17.88 6.28 12.25 12.25 0 0 1-1.79 1.81 3.54 3.54 0 0 0-.62.66 5.74 5.74 0 0 0-.72 1.47 10.34 10.34 0 0 0-.47 3.22v.84"
    />
  </svg>
);
export default Insightful;
