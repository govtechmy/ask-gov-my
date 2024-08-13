import AlarmTriangle from '@/icons/alarmtriangle';
import ThreeDotted from '@/icons/threedotted';
import { useState } from 'react';
import MarkAsSpamModal from './MarkAsSpamModal';
import { Question } from '@/types/types';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Popover } from '../ui/popover';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Dialog } from '../ui/dialog';
import { markQuestionAsSpam } from '@/actions/userServices';
import { DialogTrigger } from '@radix-ui/react-dialog';

interface ThreeProps {
  question: Question;
  handleMarkAsSpamToast: Function;
}
// import the function here as props
const ThreeDottedMarkAsSpam: React.FC<ThreeProps> = ({
  question,
  handleMarkAsSpamToast,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isModalMarkAsSpamOpen, setIsModalMarkAsSpamOpen] = useState(false);
  const [isModalUnSpamOpen, setIsModalUnSpamOpen] = useState(false);

  const handleDropdownClick = () => {
    setIsDropdownVisible(prevState => !prevState);
  };

  const handleMarkAsSpamTrigger = () => {
    setIsModalMarkAsSpamOpen(true);
  };

  const handleUnSpamTrigger = () => {
    setIsModalMarkAsSpamOpen(true);
  };

  async function markAsSpam() {
    await markQuestionAsSpam(question.id);
    question.state = 'spam';
    handleMarkAsSpamToast();
    setIsModalMarkAsSpamOpen(false);
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          className={cn('top-[-16px] right-[-6px]')}
          variant={'icon-threedot'}
          size={'icon'}
          onClick={handleDropdownClick}
        >
          <ThreeDotted />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Dialog
          open={isModalMarkAsSpamOpen}
          onOpenChange={setIsModalMarkAsSpamOpen}
        >
          <DialogTrigger asChild>
            <Button variant={'tertiary'}>
              <AlarmTriangle className="stroke-[#DC2626] dark:stroke-[#FF5959]" />
              Mark As Spam
            </Button>
            <div
              className="text-sm font-medium text-[#DC2626] dark:text-[#FF5959] px-2 cursor-pointer"
              onClick={handleMarkAsSpamTrigger}
            ></div>
          </DialogTrigger>
          {isDropdownVisible && (
            <div
              className="absolute top-[20px] right-[-6px] w-[153px] h-[42px]
         bg-white-focuswhite100 border-[1px] border-outline-200 shadow-button rounded-lg"
            >
              <div
                className="absolute top-[4px] right-[4px] w-[143px] h-[32px] 
            items-center flex justify-center rounded-[4px]
            bg-washed-100"
              >
                <div className="pl-2"></div>

                <MarkAsSpamModal
                  handleMarkAsSpamToast={handleMarkAsSpamToast}
                  question={question}
                  isOpen={isModalMarkAsSpamOpen}
                  onClose={() => setIsModalMarkAsSpamOpen(false)}
                />
              </div>
            </div>
          )}
        </Dialog>
      </PopoverContent>
    </Popover>
  );
};

export default ThreeDottedMarkAsSpam;
