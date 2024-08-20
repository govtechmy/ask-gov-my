export default function Search({
  strokeWidth = 1.5,
  className = '',
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
        d="M17.25 17.25L13.5 13.5M2.75 9C2.75 5.54822 5.54822 2.75 9 2.75C12.4518 2.75 15.25 5.54822 15.25 9C15.25 12.4518 12.4518 15.25 9 15.25C5.54822 15.25 2.75 12.4518 2.75 9Z"
        className={className}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
