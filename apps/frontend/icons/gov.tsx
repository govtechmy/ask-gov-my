export default function Gov({
  className = 'stroke-[#18181B] dark:stroke-[#FFFFFF]',
  ...props
}) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13 8.8V11.2M2.99995 11.2V8.8M6.19995 11.2V8.8M9.79995 11.2V8.8M2.19995 13.6H13.8M7.99995 2L13.8 6.4H2.19995L7.99995 2Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
    </svg>
  );
}
