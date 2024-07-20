'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/lib/i18n';

interface Topic {
  id: number;
  title: string;
  title_ms?: string;
}

interface DropdownMenuProps {
  topics: Topic[];
  locale: string;
  selectedTopicId?: number;
  agencyAcronym?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  topics,
  locale,
  selectedTopicId,
  agencyAcronym,
}) => {
  const t = useTranslations('Topics');
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
      const selected =
        topics.find(topic => topic.id === selectedTopicId) || null;
      setSelectedTopic(selected);
    }
  }, [selectedTopicId, topics]);

  const constructHref = (topicId: number) => {
    return currentPath.includes('/topics/')
      ? currentPath.replace(/\/topics\/\d+$/, `/topics/${topicId}`)
      : `${currentPath}/topics/${topicId}`;
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (topic: Topic | null) => {
    if (topic) {
      router.push(constructHref(topic.id));
    } else {
      router.push(`/${agencyAcronym}`);
    }
    setSelectedTopic(topic);
    setIsOpen(false);
  };

  return (
    <div className="relative pt-6">
      <div className="p-4">
        <div
          className="h-10 w-[324px] bg-white border border-gray-300 rounded-lg flex items-center justify-between px-3 cursor-pointer"
          onClick={toggleDropdown}
        >
          <span className="text-gray-600">{t('topic')}</span>
          <span className="font-medium text-black-800">
            {selectedTopic
              ? locale === 'ms'
                ? selectedTopic.title_ms
                : selectedTopic.title
              : t('alltopics')}
          </span>
          <span className="text-black-800">▼</span>
        </div>
        {isOpen && (
          <ul className="absolute w-[324px] bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto z-10">
            <li
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(null)}
            >
              {t('alltopics')}
            </li>
            {topics.map(topic => (
              <li
                key={topic.id}
                className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${selectedTopicId === topic.id ? 'bg-gray-100' : ''}`}
                onClick={() => handleSelect(topic)}
              >
                <span className="truncate">
                  {locale === 'ms' ? topic.title_ms : topic.title}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DropdownMenu;
