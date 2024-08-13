export default function AlarmTriangle({ className = '', ...props }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 8.00001V10M2.95221 14.3536L8.21521 3.85659C8.95311 2.38482 11.0539 2.38521 11.7913 3.85724L17.0495 14.3543C17.7156 15.6841 16.7487 17.25 15.2613 17.25H4.74008C3.25235 17.25 2.28541 15.6835 2.95221 14.3536Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
      <path
        d="M10 12.25C9.30964 12.25 8.75 12.8096 8.75 13.5C8.75 14.1904 9.30964 14.75 10 14.75C10.6904 14.75 11.25 14.1904 11.25 13.5C11.25 12.8096 10.6904 12.25 10 12.25Z"
        fill="currentColor"
        transform="scale(0.6) translate(7,9)"
        className={className}
      />
    </svg>
  );
}
