export default function IconQuestionSmile({
  className = 'stroke-[#E4E4E7] dark:stroke-[##27272A]',
  ...props
}) {
  return (
    <svg
      width="24"
      height="41"
      viewBox="0 0 24 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect
        x="0.5"
        y="0.5"
        width="23"
        height="23"
        rx="11.5"
        fill="url(#paint0_radial_19240_684)"
      />
      <rect
        x="0.5"
        y="0.5"
        width="23"
        height="23"
        rx="11.5"
        className={className}
      />
      <rect x="6" y="9" width="2" height="4" rx="1" fill="#5B1AE6" />
      <rect x="16" y="9" width="2" height="4" rx="1" fill="#5B1AE6" />
      <path
        d="M15 14H9C9 15.6569 10.3431 17 12 17C13.6569 17 15 15.6569 15 14Z"
        fill="#5B1AE6"
      />
      <path
        d="M12 32V40"
        stroke="#D4D4D8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <radialGradient
          id="paint0_radial_19240_684"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(12 9) rotate(90) scale(18)"
        >
          <stop offset="0.232862" stopColor="#F8F4FF" />
          <stop offset="1" stopColor="#DDC7FF" />
        </radialGradient>
      </defs>
    </svg>
  );
}
