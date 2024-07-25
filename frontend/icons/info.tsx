export default function Info({
  className = '',
  classNameDot = '',
  classNameBox = '',
  ...props
}) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNameBox}
    >
      <path
        d="M8 15.25C12.0041 15.25 15.25 12.0041 15.25 8C15.25 3.99594 12.0041 0.75 8 0.75C3.99594 0.75 0.75 3.99594 0.75 8C0.75 12.0041 3.99594 15.25 8 15.25Z"
        stroke="#702FF9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
      <path
        d="M8 9V11"
        stroke="#702FF9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
      <path
        d="M8 4.25C7.30964 4.25 6.75 4.80964 6.75 5.5C6.75 6.19036 7.30964 6.75 8 6.75C8.69036 6.75 9.25 6.19036 9.25 5.5C9.25 4.80964 8.69036 4.25 8 4.25Z"
        fill="#702FF9"
        className={classNameDot}
      />
    </svg>
  );
}
