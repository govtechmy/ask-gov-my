'use client';

interface Topic {
  id: number;
  title: string;
  title_ms?: string;
}

interface TopicListProps {
  topics: Topic[];
  locale: string;
  selectedTopicId?: number;
}

const TopicList: React.FC<TopicListProps> = ({ topics, locale, selectedTopicId }) => {
  const constructHref = (topicId: number) => {
    const currentPath = window.location.pathname;
    return currentPath.includes('/topics/') //do ternary operator to check if already got 'topics' in url
      ? currentPath.replace(/\/topics\/\d+$/, `/topics/${topicId}`)
      : `${currentPath}/topics/${topicId}`;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Topics</h2>
      <ul>
        {topics.map((topic) => (
          <li key={topic.id} className="mb-2">
            <a
              href={constructHref(topic.id)}
              className={`text-blue-500 hover:underline ${selectedTopicId === topic.id ? 'bg-purple-100' : ''}`}
            >
              {locale === 'ms' ? topic.title_ms : topic.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopicList;
