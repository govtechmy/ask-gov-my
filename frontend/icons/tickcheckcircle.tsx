export default function TickCheckCircle({
  className = 'stroke-[#15803D]',
  ...props
}) {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M14.6999 23.55L17.0655 26.2745C17.9731 27.3199 19.6264 27.2162 20.3964 26.0656L27.2999 15.75M36.2249 21C36.2249 29.4086 29.4084 36.225 20.9999 36.225C12.5914 36.225 5.7749 29.4086 5.7749 21C5.7749 12.5915 12.5914 5.77502 20.9999 5.77502C29.4084 5.77502 36.2249 12.5915 36.2249 21Z"
        stroke="#15803D"
        stroke-width="3.15"
        stroke-linecap="round"
        stroke-linejoin="round"
        className={className}
      />
    </svg>
  );
}
