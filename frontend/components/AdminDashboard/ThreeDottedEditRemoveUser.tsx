import ThreeDotted from '@/icons/threedotted';
import { useState } from 'react';
import Pencil from '@/icons/pencil';
import TrashIcon from '@/icons/trashicon';
import UserSettingsModal from './UserSettingsModal';
import { User, Agency } from '@/types/types';
import MarkAsDeleteModal from './MarkAsDeleteModal';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface ThreeProps {
  user: User;
  onUpdate: () => void;
  agencies: Agency[];
  handleDeleteUserToast: Function;
  handleEditUserToast: Function;
}

const ThreeDottedEditRemoveUser: React.FC<ThreeProps> = ({
  user,
  onUpdate,
  agencies,
  handleDeleteUserToast,
  handleEditUserToast,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleDropdownClick = () => {
    setIsDropdownVisible(prevState => !prevState);
  };

  const [isModalEditUserOpen, setIsModalEditUserOpen] = useState(false);
  const [isModalDeleteUserOpen, setIsModalDeleteUserOpen] = useState(false);

  function handleIsModalEditUserOpen() {
    setIsModalEditUserOpen(true);
  }
  function handleIsModalDeleteUserOpen() {
    setIsModalDeleteUserOpen(true);
  }

  return (
    <div className="relative">
      <div className="flex relative">
        <Button
          className={cn('top-[-16px] right-[18px]', {
            'opacity-100': isDropdownVisible,
            'group-hover:opacity-100': !isDropdownVisible,
          })}
          variant={'icon-threedot'}
          size={'icon'}
          onClick={handleDropdownClick}
        >
          <ThreeDotted />
        </Button>
      </div>
      {isDropdownVisible && (
        <div className="absolute top-[20px] right-[18px] w-[120px] h-[74px] bg-white-focuswhite100 border-[1px] border-outline-200 shadow-button rounded-lg z-10">
          <div
            className="h-[32px] w-[110px] flex items-center justify-start hover:bg-washed-100 mx-1 mt-1 rounded"
            onClick={handleIsModalEditUserOpen}
          >
            <div className="h-5 w-5 items-center  justify-center flex ml-[10px]">
              <Pencil className="stroke-black-700"></Pencil>
            </div>

            <div className="text-sm font-medium text-black-700 px-2 cursor-pointer">
              Edit
            </div>
          </div>
          <div
            className="h-[32px] w-[110px] flex items-center justify-start hover:bg-washed-100 mx-1 mb-1 rounded text-[#DC2626]"
            onClick={handleIsModalDeleteUserOpen}
          >
            <div className="h-5 w-5 items-center  justify-center flex ml-[10px]">
              <TrashIcon className="stroke-current"></TrashIcon>
            </div>

            <div className="text-sm font-medium px-2 cursor-pointer">
              Delete
            </div>
          </div>
        </div>
      )}
      <UserSettingsModal
        user={user}
        isOpen={isModalEditUserOpen}
        onClose={() => {
          setIsModalEditUserOpen(false);
          onUpdate();
        }}
        agencies={agencies}
        handleEditUserToast={handleEditUserToast}
      />
      <MarkAsDeleteModal
        handleDeleteUserToast={handleDeleteUserToast}
        user={user}
        isOpen={isModalDeleteUserOpen}
        onClose={() => {
          setIsModalDeleteUserOpen(false);
        }}
      ></MarkAsDeleteModal>
    </div>
  );
};

export default ThreeDottedEditRemoveUser;
