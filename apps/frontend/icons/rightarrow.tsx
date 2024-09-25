export default function RightArrow({
  className = 'stroke-[#18181B] dark:stroke-[#FFFFFF]',
  ...props
}) {
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
        d="M8 5L13 10L8 15"
        className={className}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
