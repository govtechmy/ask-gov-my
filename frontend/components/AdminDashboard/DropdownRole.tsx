import React, { useState, Dispatch, SetStateAction } from 'react';
import AgencyListDropdownUsersModal from './AgencyListDropdownUsersModal';
import ChevronDown from '@/icons/ChevronDown';
import { Agency, User } from '@/types/types';

type Role = 'staff' | 'super_admin' | 'unassigned';

interface DropdownRoleProps {
  agencies: Agency[];
  setRole: Dispatch<SetStateAction<Exclude<Role, 'unassigned'>>>;
  setAgency: Dispatch<SetStateAction<number | null>>;
  roleEmpty: boolean;
  user?: Partial<User>;
}

const DropdownRole: React.FC<DropdownRoleProps> = ({
  agencies,
  setRole,
  setAgency,
  roleEmpty,
  user = { role: 'unassigned' as const, agency: null },
}) => {
  const initialRole: Role =
    user.role === 'staff' || user.role === 'super_admin'
      ? user.role
      : 'unassigned';
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleRoleSelect = (role: Exclude<Role, 'unassigned'>) => {
    setRole(role);
    setSelectedRole(role);
    setIsOpen(false);
  };

  const formatRoleDisplay = (role: Role): string => {
    switch (role) {
      case 'super_admin':
        return 'Superadmin';
      case 'staff':
        return 'Staff';
      case 'unassigned':
        return 'Unassigned';
      default:
        return 'Unassigned';
    }
  };

  return (
    <div className="mb-4">
      <div className="relative">
        <div
          className="h-10 pl-4 flex justify-between items-center w-full border-[1px] border-outline-200 rounded-md shadow-button bg-white text-sm font-medium text-black-700 cursor-pointer z-0"
          onClick={toggleDropdown}
        >
          {formatRoleDisplay(selectedRole)}
          <div className="pr-2">
            <ChevronDown
              className={`h-5 w-5 transition-transform transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
        {isOpen && (
          <div className="origin-top-right absolute right-0 mt-2 w-full rounded-lg shadow-button bg-white border-[1px] border-outline-200 text-black-700 text-base font-medium z-50">
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <div
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRoleSelect('staff')}
              >
                Staff
              </div>
              <div
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRoleSelect('super_admin')}
              >
                Superadmin
              </div>
            </div>
          </div>
        )}
      </div>
      {selectedRole === 'staff' && (
        <>
          <div className="text-black-700 text-sm font-medium pt-6 mb-[6px]">
            Agency
          </div>
          <div className="relative">
            <AgencyListDropdownUsersModal
              agencies={agencies}
              setAgency={setAgency}
            />
          </div>
        </>
      )}
      {roleEmpty && selectedRole === 'unassigned' && (
        <div className="text-red-500 text-sm mt-2">Please select a role</div>
      )}
    </div>
  );
};

export default DropdownRole;
