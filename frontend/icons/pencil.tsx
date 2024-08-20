export default function Pencil({ className = '', ...props }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.75 8.08578L11.75 5.08578M3 16.8358L7.25 15.8358L16.5429 6.5429C16.9334 6.15237 16.9334 5.51921 16.5429 5.12868L14.7071 3.2929C14.3166 2.90237 13.6834 2.90237 13.2929 3.2929L4 12.5858L3 16.8358Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
    </svg>
  );
}
