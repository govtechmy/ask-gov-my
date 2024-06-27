import React from 'react';

interface ArrowleftProps {
  className: string;
}

const Arrowleft1: React.FC<ArrowleftProps> = ({
  className = "stroke-zinc-700 dark:stroke-zinc-300",
  ...props
}) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M8.25 4.75L2.75 10L8.25 15.25M17.25 10H3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Arrowleft1;

// using it in text
{/* <Arrowleft className="stroke-[#3F3F46] dark:stroke-[#D4D4D8]"></Arrowleft> */}