export default function PlusCircle({ className = '', ...props }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="0.5" y="0.5" width="23" height="23" rx="11.5" fill="white" />
      <rect x="0.5" y="0.5" width="23" height="23" rx="11.5" stroke="#E4E4E7" />
      <path
        d="M12 6V18M18 12H6"
        stroke="#71717A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
    </svg>
  );
}
