export default function Close({
  className = 'stroke-[#E4E4E7] dark:stroke-[#27272A] shrink-0',
  ...props
}) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M10.7249 1.27502L1.2749 10.725M1.2749 1.27502L10.7249 10.725"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
    </svg>
  );
}
