export default function IconQuestionSmile2({ className = '', ...props }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="0.5"
        y="0.5"
        width="23"
        height="23"
        rx="11.5"
        fill="url(#paint0_radial_18869_12004)"
      />
      <rect x="0.5" y="0.5" width="23" height="23" rx="11.5" stroke="#E4E4E7" />
      <rect x="6" y="9" width="2" height="4" rx="1" fill="#5B1AE6" />
      <rect x="16" y="9" width="2" height="4" rx="1" fill="#5B1AE6" />
      <path
        d="M15 14H9C9 15.6569 10.3431 17 12 17C13.6569 17 15 15.6569 15 14Z"
        fill="#5B1AE6"
      />
      <defs>
        <radialGradient
          id="paint0_radial_18869_12004"
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
