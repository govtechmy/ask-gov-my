export default function PlusIcon({
  className = 'stroke-[#18181B] dark:stroke-[#FFFFFF]',
}) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 4V16M16 10H4"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className={className}
      />
    </svg>
  );
}
