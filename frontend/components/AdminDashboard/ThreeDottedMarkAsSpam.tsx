import AlarmTriangle from '@/icons/alarmtriangle';
import ThreeDotted from '@/icons/threedotted';
import { useState, useEffect, useRef } from 'react';

const ThreeDottedMarkAsSpam: React.FC = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setIsDropdownVisible(prevState => !prevState);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownVisible(false);
    }
  };

  //   useEffect(() => {
  //     if (isDropdownVisible) {
  //       document.addEventListener('mousedown', handleClickOutside);
  //     } else {
  //       document.removeEventListener('mousedown', handleClickOutside);
  //     }

  //     return () => {
  //       document.removeEventListener('mousedown', handleClickOutside);
  //     };
  //   }, [isDropdownVisible]);

  return (
    <div className="relative">
      <div className="group flex relative" ref={dropdownRef}>
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
            bg-washed-100 "
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
    </div>
  );
};

export default ThreeDottedMarkAsSpam;
