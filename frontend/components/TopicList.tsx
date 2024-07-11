import Link from 'next/link';

interface Topic {
  id: number;
  title: string;
  title_ms?: string; 
}

interface TopicListProps {
  topics: Topic[];
  locale: string;
}

const TopicList: React.FC<TopicListProps> = ({ topics, locale }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Topics</h2>
      <ul>
        <li className="mb-2">
          <Link href="/topics/all">
            <a className="text-blue-500">All topics</a>
          </Link>
        </li>
        {topics.map((topic) => (
          <li key={topic.id} className="mb-2">
            <Link href={`${window.location.pathname}/${topic.id}`}>
              <a className="text-blue-500 hover:underline">
                {locale === 'ms' ? topic.title_ms : topic.title}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopicList;
