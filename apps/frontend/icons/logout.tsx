export default function Logout({
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
    >
      <path
        d="M13.75 6.75L17.25 10L13.75 13.25M17 10H7.75M11.25 2.75H4.75C3.64543 2.75 2.75 3.64543 2.75 4.75V15.25C2.75 16.3546 3.64543 17.25 4.75 17.25H11.25"
        stroke="#DC2626"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
    </svg>
  );
}
