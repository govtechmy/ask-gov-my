import ThreeDotted from '@/icons/threedotted';
import { useState } from 'react';
import { Question } from '@/types/types';
import TickCheckCircle from '@/icons/tickcheckcircle';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import { unSpamQuestion } from '@/actions/userServices';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ThreeProps {
  question: Question;
  handleUnSpamToast: Function;
}

const ThreeDottedMarkAsUnSpam: React.FC<ThreeProps> = ({
  question,
  handleUnSpamToast,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isModalMarkAsUnSpamOpen, setIsModalMarkAsUnSpamOpen] = useState(false);

  const handleDropdownClick = () => {
    setIsDropdownVisible(prevState => !prevState);
  };

  async function MarkQuestionAsBacklog() {
    await unSpamQuestion(question.id);
    question.state = 'backlog';
    handleUnSpamToast();
    setIsModalMarkAsUnSpamOpen(false);
  }

  return (
    <Popover>
      <PopoverTrigger asChild className="size-9">
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
          open={isModalMarkAsUnSpamOpen}
          onOpenChange={setIsModalMarkAsUnSpamOpen}
        >
          <DialogTrigger asChild>
            <Button variant={'tertiary'}>
              <TickCheckCircle className="text-black-700 size-5" />
              Mark as not spam
            </Button>
          </DialogTrigger>

          <DialogContent className="w-[400px]">
            <DialogHeader>
              <DialogTitle>Mark question as not spam?</DialogTitle>

              <DialogDescription>
                Are you sure to mark this question as not spam?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex justify-end items-center space-x-3">
              <Button
                variant={'secondary'}
                onClick={() => setIsModalMarkAsUnSpamOpen(false)}
              >
                Cancel
              </Button>
              <Button variant={'primary'} onClick={MarkQuestionAsBacklog}>
                Mark as Not Spam
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PopoverContent>
    </Popover>
  );
};

export default ThreeDottedMarkAsUnSpam;
