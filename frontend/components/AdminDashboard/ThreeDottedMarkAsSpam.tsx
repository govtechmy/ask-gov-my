import AlarmTriangle from '@/icons/alarmtriangle';
import ThreeDotted from '@/icons/threedotted';
import { useState } from 'react';
import { Question } from '@/types/types';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import { markQuestionAsSpam } from '@/actions/userServices';

interface ThreeProps {
  question: Question;
  handleMarkAsSpamToast: Function;
}

const ThreeDottedMarkAsSpam: React.FC<ThreeProps> = ({
  question,
  handleMarkAsSpamToast,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isModalMarkAsSpamOpen, setIsModalMarkAsSpamOpen] = useState(false);

  const handleDropdownClick = () => {
    setIsDropdownVisible(prevState => !prevState);
  };

  async function markAsSpam() {
    await markQuestionAsSpam(question.id);
    question.state = 'spam';
    handleMarkAsSpamToast();
    setIsModalMarkAsSpamOpen(false);
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
          open={isModalMarkAsSpamOpen}
          onOpenChange={setIsModalMarkAsSpamOpen}
        >
          <DialogTrigger asChild className="text-danger-600">
            <Button variant={'tertiary'}>
              <AlarmTriangle />
              Mark As Spam
            </Button>
          </DialogTrigger>

          <DialogContent className="w-[400px] p-3">
            <DialogHeader>
              <DialogTitle> Mark question as spam?</DialogTitle>
              <DialogDescription>
                Are you sure to mark this question as spam?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                variant={'secondary'}
                onClick={() => setIsModalMarkAsSpamOpen(false)}
              >
                Cancel
              </Button>
              <Button variant={'danger-primary'} onClick={markAsSpam}>
                Mark as Spam
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PopoverContent>
    </Popover>
  );
};

export default ThreeDottedMarkAsSpam;
