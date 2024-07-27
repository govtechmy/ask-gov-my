import { useState } from 'react';

interface Agency {
  id: number;
  name: string;
}

interface DropdownRoleProps {
  agencies: Agency[];
}

const DropdownRole: React.FC<DropdownRoleProps> = ({ agencies }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);
  const [isAgencyOpen, setIsAgencyOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleAgencyDropdown = () => setIsAgencyOpen(!isAgencyOpen);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setIsOpen(false);
  };

  const handleAgencySelect = (agency: string) => {
    setSelectedAgency(agency);
    setIsAgencyOpen(false);
  };

  return (
    <div className="mb-4">
      <div className="relative">
        <div
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
          onClick={toggleDropdown}
        >
          {selectedRole ? selectedRole : 'Unassigned'}
        </div>
        {isOpen && (
          <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
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
                onClick={() => handleRoleSelect('Super Admin')}
              >
                Super Admin
              </div>
            </div>
          </div>
        )}
      </div>
      {selectedRole === 'Staff' && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agency:
          </label>
          <div className="relative">
            <div
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              onClick={toggleAgencyDropdown}
            >
              {selectedAgency ? selectedAgency : 'Select Agency'}
            </div>
            {isAgencyOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  {agencies.map(agency => (
                    <div
                      key={agency.id}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleAgencySelect(agency.name)}
                    >
                      {agency.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownRole;
