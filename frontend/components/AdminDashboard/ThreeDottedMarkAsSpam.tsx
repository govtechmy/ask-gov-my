import AlarmTriangle from '@/icons/alarmtriangle';
import ThreeDotted from '@/icons/threedotted';
import { useState } from 'react';
import ModalMarkAsSpam from './ModalMarkAsSpam';

const ThreeDottedMarkAsSpam: React.FC = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isModalMarkAsSpamOpen, setIsModalMarkAsSpamOpen] = useState(false);

  const handleClick = () => {
    setIsDropdownVisible(prevState => !prevState);
  };

  const handleMarkAsSpamClick = () => {
    setIsModalMarkAsSpamOpen(true);
    setIsDropdownVisible(false);
  };

  return (
    <div className="relative">
      <div className="group flex relative">
        <div
          className={`opacity-0 ${isDropdownVisible ? 'opacity-100' : 'group-hover:opacity-100'}
          h-8 w-8 border-[1px] border-outline-200 bg-white rounded-lg shadow-button
          items-center justify-center absolute flex top-[-16px] right-[-6px]`}
          onClick={handleClick}
        >
          <ThreeDotted className="fill-black-900 stroke-black-700" />
        </div>
      </div>
      {isDropdownVisible && (
        <div
          className="absolute top-[20px] right-[-6px] w-[153px] h-[42px]
         bg-white-focuswhite100 border-[1px] border-outline-200 shadow-button rounded-lg"
        >
          <div
            className="absolute top-[4px] right-[4px] w-[143px] h-[32px] 
            items-center flex justify-center rounded-[4px]
            bg-washed-100 cursor-pointer"
            onClick={handleMarkAsSpamClick}
          >
            <div className="pl-2">
              <AlarmTriangle className="stroke-[#DC2626] dark:stroke-[#FF5959]"></AlarmTriangle>
            </div>
            <div className="text-sm font-medium text-[#DC2626] dark:text-[#FF5959] px-2">
              Mark As Spam
            </div>
          </div>
        </div>
      )}
      <ModalMarkAsSpam
        isOpen={isModalMarkAsSpamOpen}
        onClose={() => setIsModalMarkAsSpamOpen(false)}
      />
    </div>
  );
};

export default ThreeDottedMarkAsSpam;
