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

interface ThreeDottedActionProps {
  question: Question;
  handleActionToast: Function;
  actionFunction: (questionId: number) => Promise<void>; // Changed to number
  actionText: string;
  actionIcon: React.ReactNode;
  dialogTitle: string;
  dialogDescription: string;
  confirmButtonText: string;
  confirmButtonVariant: 'danger-primary' | 'primary';
  newState: 'spam' | 'backlog';
}

const ThreeDottedAction: React.FC<ThreeDottedActionProps> = ({
  question,
  handleActionToast,
  actionFunction,
  actionText,
  actionIcon,
  dialogTitle,
  dialogDescription,
  confirmButtonText,
  confirmButtonVariant,
  newState,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDropdownClick = () => {
    setIsDropdownVisible(prevState => !prevState);
  };

  async function handleAction() {
    await actionFunction(question.id);
    question.state = newState;
    handleActionToast();
    setIsModalOpen(false);
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
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild className="text-danger-600">
            <Button variant={'tertiary'}>
              {actionIcon}
              {actionText}
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[400px]">
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription>{dialogDescription}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant={'secondary'}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant={confirmButtonVariant} onClick={handleAction}>
                {confirmButtonText}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PopoverContent>
    </Popover>
  );
};

export default ThreeDottedAction;
