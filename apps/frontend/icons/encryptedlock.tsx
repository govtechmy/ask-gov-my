export default function EncryptedLock({
  className = 'stroke-[#18181B] dark:stroke-[#FFFFFF]',
  ...props
}) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8.39995 13.68H15.6042M8.39995 17.04H15.6042M7.19995 9.60001V8.40001C7.19995 5.74904 9.34898 3.60001 12 3.60001C14.6509 3.60001 16.8 5.74904 16.8 8.40001V9.60001M4.8042 11.4C4.8042 10.7372 5.34146 10.2 6.0042 10.2H18C18.6627 10.2 19.2 10.7372 19.2 11.4V18.3C19.2 19.6255 18.1255 20.7 16.8 20.7H7.2042C5.87872 20.7 4.8042 19.6255 4.8042 18.3V11.4Z"
        stroke="#71717A"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={className}
      />
    </svg>
  );
}
