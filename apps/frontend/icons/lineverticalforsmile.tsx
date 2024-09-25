interface LineVerticalForSmileProps {
  className?: string;
  height?: number;
}

const LineVerticalForSmile: React.FC<LineVerticalForSmileProps> = ({
  className = '',
  height = 2,
  ...props
}) => {
  return (
    <svg
      width="2"
      height={height}
      viewBox={`0 0 2 ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d={`M1 1V${height}`}
        stroke="#D4D4D8"
        strokeWidth="2"
        strokeLinecap="round"
        className={className}
      />
    </svg>
  );
};

export default LineVerticalForSmile;
