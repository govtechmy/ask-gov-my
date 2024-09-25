export default function TickCheckCircleinCircle({
  className = 'stroke-[#15803D]',
  ...props
}) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="0.5"
        width="23"
        height="23"
        rx="11.5"
        fill="white"
        className={className}
      />
      <rect x="0.5" y="0.5" width="23" height="23" rx="11.5" stroke="#E4E4E7" />
      <path
        d="M9 13.2143L10.1265 14.5116C10.5587 15.0095 11.3459 14.9601 11.7126 14.4122L15 9.5M19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12Z"
        stroke="#16A34A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
    </svg>
  );
}
