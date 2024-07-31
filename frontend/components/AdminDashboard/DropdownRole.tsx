import { useState } from 'react';
import AgencyListDropdownUsersModal from './AgencyListDropdownUsersModal';
import ChevronDown from '@/icons/ChevronDown';
import { Agency } from '@/types/types';
import { getDynamicAgencyMap } from '@/actions/questionServices';

interface DropdownRoleProps {
  agencies: Agency[];
}

const DropdownRole: React.FC<DropdownRoleProps> = ({ agencies }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setIsOpen(false);
  };

  const AGENCY_TO_UUID = getDynamicAgencyMap();

  return (
    <div className="mb-4">
      <div className="relative">
        <div
          className="h-10 pl-4 flex justify-between items-center w-full border-[1px] border-outline-200 rounded-md shadow-button bg-white text-sm font-medium text-black-700 cursor-pointer z-0"
          onClick={toggleDropdown}
        >
          {selectedRole ? selectedRole : 'Unassigned'}
          <div className="pr-2">
            <ChevronDown
              className={`h-5 w-5 transition-transform transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
        {isOpen && (
          <div
            className="origin-top-right absolute right-0 mt-2 w-full rounded-lg shadow-button bg-white border-[1px] border-outline-200
          text-black-700 text-base font-medium z-50"
          >
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <div
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRoleSelect('Staff')}
              >
                Staff
              </div>
              <div
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRoleSelect('Superadmin')}
              >
                Superadmin
              </div>
            </div>
          </div>
        )}
      </div>
      {selectedRole === 'Staff' && (
        <>
          <div className="text-black-700 text-sm font-medium pt-6 mb-[6px]">
            Agency
          </div>
          <div className="relative">
            <AgencyListDropdownUsersModal AGENCY_TO_UUID={AGENCY_TO_UUID} />
          </div>
        </>
      )}
    </div>
  );
};

export default DropdownRole;
