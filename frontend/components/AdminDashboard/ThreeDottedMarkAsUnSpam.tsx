import ThreeDotted from '@/icons/threedotted';
import { useState } from 'react';
import { Question } from '@/types/types';
import TickCheckCircle from '@/icons/tickcheckcircle';
import MarkAsUnSpamModal from './MarkAsUnSpamModal';

interface ThreeProps {
  question: Question;
  handleUnSpamToast: Function;
}

const ThreeDottedMarkAsUnSpam: React.FC<ThreeProps> = ({ question, handleUnSpamToast }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isModalMarkAsUnSpamOpen, setIsModalMarkAsUnSpamOpen] = useState(false);

  const handleDropdownClick = () => {
    setIsDropdownVisible(prevState => !prevState);
  };

  const handleMarkAsUnSpamTrigger = () => {
    setIsModalMarkAsUnSpamOpen(true);
  };

  return (
    <div className="relative">
      <div className="group flex relative">
        <div
          className={`opacity-0 ${isDropdownVisible ? 'opacity-100' : 'group-hover:opacity-100'}
          h-8 w-8 border-[1px] border-outline-200 bg-white rounded-lg shadow-button
          items-center justify-center absolute flex top-[-16px] right-[-6px]`}
          onClick={handleDropdownClick}
        >
          <ThreeDotted className="fill-black-900 stroke-black-700" />
        </div>
      </div>
      {isDropdownVisible && (
        <div
          className="absolute top-[20px] right-[-6px] w-[177px] h-[42px]
         bg-white-focuswhite100 border-[1px] border-outline-200 shadow-button rounded-lg items-center justify-center flex"
        >
          <div className="pl-2">
            <div className="h-5 w-5 items-center  justify-center flex">
              <TickCheckCircle className="stroke-black-700"></TickCheckCircle>
            </div>
          </div>
          <div
            className="text-sm font-medium text-black-700 px-2 cursor-pointer"
            onClick={handleMarkAsUnSpamTrigger}
          >
            Mark as not spam
          </div>
          <MarkAsUnSpamModal
            handleUnSpamToast={handleUnSpamToast}
            question={question}
            isOpen={isModalMarkAsUnSpamOpen}
            onClose={() => setIsModalMarkAsUnSpamOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ThreeDottedMarkAsUnSpam;
