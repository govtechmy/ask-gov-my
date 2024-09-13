export default function PlusIcon({
  className = 'stroke-[#18181B] dark:stroke-[#FFFFFF]',
  width = '20',
  height = '20',
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 4V16M16 10H4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
    </svg>
  );
}
