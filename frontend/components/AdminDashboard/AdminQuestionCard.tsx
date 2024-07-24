import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { AGENCY_TO_UUID } from '@/lib/agency';
import {
  assignAgencyToQuestion,
  changeAdminIsOpen,
} from '@/actions/userServices';
import NewUpdateIcon from '@/icons/new';
import { Question } from '@/types/types';
import AgencyListDropdownOnCard from './AgencyListDropdownOnCard';
import ModalQuestionCard from './ModalQuestionCard';
import ThreeDottedMarkAsSpam from './ThreeDottedMarkAsSpam';

interface QuestionCardProps {
  question: Question;
  activeQuestionId: number | null;
  setactiveQuestionId: React.Dispatch<React.SetStateAction<number | null>>;
}

const AdminQuestionCard: React.FC<QuestionCardProps> = ({
  question,
  activeQuestionId,
  setactiveQuestionId,
}) => {
  const t = useTranslations('Agency');
  const [selectedAgency, setSelectedAgency] = useState<string>('Unassigned');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (question.agency !== null) {
      const agencyAcronym = Object.keys(AGENCY_TO_UUID).find(
        key => AGENCY_TO_UUID[key] === question.agency!.toString(),
      );
      if (agencyAcronym) {
        setSelectedAgency(agencyAcronym);
      }
    }
  }, [question.agency]);

  const handleCardClick = async () => {
    setIsModalOpen(true);
    if (!question.admin_isopen) {
      try {
        await changeAdminIsOpen(question.id);
        question.admin_isopen = true;
      } catch (error) {
        console.error('Failed to change admin_isopen:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }) +
      ', ' +
      date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    );
  };

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleClick = () => {
    setIsDropdownVisible(prevState => !prevState);
  };

  return (
    <>
      <div className="bg-white items-center rounded-md border p-4 shadow-sm flex justify-between w-full">
        <div className="flex items-center">
          <div
            className="text-sm font-medium text-black-700 line-clamp-2 hover:cursor-pointer"
            onClick={handleCardClick}
          >
            {question.question}
          </div>
        </div>
        <div className="flex items-center space-x-4 pl-2">
          <div className="">
            {question.admin_isopen === false && (
              <NewUpdateIcon
                classNamePath="fill-[#F0FDF4] dark:fill-[#052E16]"
                classNameCircle="fill-[#15803D] dark:fill-[#16A34A]"
                classNamePath2="fill-[#15803D] dark:fill-[#16A34A]"
              />
            )}
            {question.admin_isopen === true && (
              <div className="h-[22px] w-[55px]"></div>
            )}
          </div>
          <div className="relative">
            <AgencyListDropdownOnCard
              selectedAgency={selectedAgency}
              setSelectedAgency={setSelectedAgency}
              AGENCY_TO_UUID={AGENCY_TO_UUID}
              setSuccessMessage={setSuccessMessage}
              activeQuestionId={activeQuestionId}
              setactiveQuestionId={setactiveQuestionId}
              questionId={question.id}
            />
          </div>
          <div className="font-normal text-sm text-dim-500 min-w-[160px] ">
            {formatDate(question.date)}
          </div>
          <ThreeDottedMarkAsSpam></ThreeDottedMarkAsSpam>
        </div>
      </div>

      <ModalQuestionCard
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        question={question}
        selectedAgency={selectedAgency}
        setSelectedAgency={setSelectedAgency}
        AGENCY_TO_UUID={AGENCY_TO_UUID}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
      />
    </>
  );
};

export default AdminQuestionCard;
