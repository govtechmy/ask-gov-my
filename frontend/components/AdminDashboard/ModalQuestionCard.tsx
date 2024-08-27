import React from 'react';
import Close from '@/icons/close';
import DateComponent from '../common/Date';
import IconQuestionSmile2 from '@/icons/iconquestionsmile2';
import LineVerticalForSmile from '@/icons/lineverticalforsmile';
import PlusCircle from '@/icons/pluscircle';
import TickCheckCircleInCircle from '@/icons/tickcheckcircleincircle';
import AgencyListDropdown from './AgencyListDropdown';
import { Agency, Question } from '@/types/types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  selectedAgency: string;
  setSelectedAgency: React.Dispatch<React.SetStateAction<string>>;
  AGENCY_TO_UUID: Record<string, string>;
  successMessage: string;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
  agencies: Agency[];
}

const ModalQuestionCard: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  question,
  selectedAgency,
  setSelectedAgency,
  AGENCY_TO_UUID,
  successMessage,
  setSuccessMessage,
  agencies,
}) => {
  const questionTextRef = React.useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = React.useState<number>(10);

  React.useEffect(() => {
    if (questionTextRef.current) {
      const textWidth = questionTextRef.current.offsetWidth;
      setSvgHeight(textWidth);
    }
  }, [question.question]);

  if (!isOpen) return null;

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

  return (
    <div className="z-10 fixed inset-0 bg-gray-900 flex items-center justify-center bg-opacity-70">
      <div className="bg-white rounded-xl shadow-lg w-[700px] relative p-6">
        <button
          onClick={onClose}
          className="absolute top-[14px] right-[14px] hover:cursor-pointer rounded-lg shadow-button h-8 w-8 flex items-center justify-center border-[1px] border-outline-200"
        >
          <Close className="stroke-black-900" />
        </button>

        <div className="text-sm text-black-700 font-medium flex">
          <div className="pr-1">Question posted</div>
          <div className="pr-2">
            <DateComponent date={formatDate(question.date)} locale={''} />
          </div>
          <div className="bg-washed-100 h-[22px] px-2 rounded -full text-xs leading-[18px] items-center flex text-dim-500">
            ID: {question.id}
          </div>
        </div>

        <div className="flex pt-[9px]">
          <div className="pr-3 flex flex-col items-center">
            <IconQuestionSmile2 />
            <div className="h-2"></div>
            <LineVerticalForSmile height={svgHeight} />
          </div>

          <div
            className="text-brand-600 text-base font-medium"
            ref={questionTextRef}
          >
            {question.question}
          </div>
        </div>

        <div className="pt-2">
          <div className="flex">
            <div className="pr-3">
              {successMessage ? (
                <TickCheckCircleInCircle className="stroke-[#16A34A]" />
              ) : (
                <PlusCircle />
              )}
            </div>
            <div>
              <div className="text-sm text-black-700 font-medium pb-[6px]">
                Assign to agency:
              </div>
              <AgencyListDropdown
                selectedAgency={selectedAgency}
                setSelectedAgency={setSelectedAgency}
                AGENCY_TO_UUID={AGENCY_TO_UUID}
                setSuccessMessage={setSuccessMessage}
                agencies={agencies}
                questionId={question.id}
              />
            </div>
          </div>
        </div>
        {successMessage && (
          <div className="mt-2 text-[#15803D] dark:text-[#16A34A]">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalQuestionCard;
