import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { AGENCY_TO_UUID } from '@/lib/agency';
import { assignAgencyToQuestion } from '@/actions/userServices';
import Modal from './Modal';
import NewUpdateIcon from '@/icons/new';
import Close from '@/icons/close';
import DateComponent from '../date';
import { Question } from '@/types/types';
import IconQuestionSmile2 from '@/icons/iconquestionsmile2';
import LineVerticalForSmile from '@/icons/lineverticalforsmile';
import PlusCircle from '@/icons/pluscircle';
import TickCheckCircleInCircle from '@/icons/tickcheckcircleincircle'; // Import the new icon
import AgencyListDropdown from './AgencyListDropdown';

interface QuestionCardProps {
  question: Question;
}

const AdminQuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const t = useTranslations('Agency');
  const [selectedAgency, setSelectedAgency] = useState<string>('Unassigned');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // New state
  const questionTextRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState<number>(10); // Default height

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

  useEffect(() => {
    if (questionTextRef.current) {
      const textWidth = questionTextRef.current.offsetWidth;
      const newHeight = textWidth;
      setSvgHeight(newHeight);
    }
  }, [question.question]);

  const handleAgencyChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newAgencyAcronym = e.target.value;
    const newAgencyId =
      newAgencyAcronym === 'Unassigned'
        ? null
        : AGENCY_TO_UUID[newAgencyAcronym];
    setSelectedAgency(newAgencyAcronym);

    if (newAgencyId !== null) {
      try {
        await assignAgencyToQuestion(question.id, parseInt(newAgencyId));
        setSuccessMessage(
          `Successfully assigned to ${newAgencyAcronym}. Their PIC will be able to answer this question.`,
        ); // Set success message
      } catch (error) {
        console.error('Failed to assign agency to question:', error);
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

  return (
    <>
      <div className="bg-white items-center rounded-md border p-4 shadow-sm flex justify-between cursor-pointer w-full">
        <div
          className="flex items-center "
          onClick={() => setIsModalOpen(true)}
        >
          <div className="text-sm font-medium text-black-700 line-clamp-2">
            {question.question}
          </div>
        </div>

        <div className="flex items-center space-x-4 pl-2">
          <div className="">
            <NewUpdateIcon
              classNamePath="fill-[#F0FDF4] dark:fill-[#052E16]"
              classNameCircle="fill-[#15803D] dark:fill-[#16A34A]"
              classNamePath2="fill-[#15803D] dark:fill-[#16A34A]"
            ></NewUpdateIcon>
          </div>
          <select
            className="border-[1px] border-outline-200 rounded-lg p-1 shadow-button"
            value={selectedAgency}
            onChange={handleAgencyChange}
          >
            <option value="Unassigned">Unassigned</option>
            {Object.keys(AGENCY_TO_UUID).map(agencyAcronym => (
              <option key={agencyAcronym} value={agencyAcronym}>
                {agencyAcronym}
              </option>
            ))}
          </select>
          <div className="font-normal text-sm text-dim-500 min-w-[160px]">
            {formatDate(question.date)}
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="relative p-6">
          <div className="absolute top-[14px] right-[14px]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="hover:cursor-pointer rounded-lg shadow-button h-8 w-8 flex items-center justify-center border-[1px] border-outline-200"
            >
              <Close className="stroke-black-900" />
            </button>
          </div>

          <div className="">
            <div className="text-sm text-black-700 font-medium flex">
              <div className="pr-1">Question posted</div>
              <div className="pr-2">
                <DateComponent
                  date={formatDate(question.date)}
                  locale={''}
                ></DateComponent>
              </div>
              <div className="bg-washed-100 h-[22px] px-2 rounded -full text-xs leading-[18px] items-center flex text-dim-500">
                ID: {question.id}
              </div>
            </div>
            <div className="flex pt-[9px] ">
              <div className="pr-3">
                <div className="flex flex-col items-center">
                  <IconQuestionSmile2 />
                  <div className="h-2"></div>
                  <LineVerticalForSmile height={svgHeight} />
                </div>
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
                    <TickCheckCircleInCircle></TickCheckCircleInCircle>
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
                    setSuccessMessage={setSuccessMessage} // Pass the function as a prop
                  />
                </div>
              </div>
            </div>
            {successMessage && (
              <div className="mt-2 text-green-600">{successMessage}</div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AdminQuestionCard;
