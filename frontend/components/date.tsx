interface Props {
  date: string;
}

const formatDateDifference = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();

  const diffTime = Math.abs(today.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return `${diffDays}d ago`;
};

const DateComponent: React.FC<Props> = ({ date }) => {
  const formattedDate = formatDateDifference(date);

  return <span>{formattedDate}</span>;
};

export default DateComponent;
