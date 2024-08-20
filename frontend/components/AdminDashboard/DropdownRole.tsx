import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import AgencyListDropdownUsersModal from './AgencyListDropdownUsersModal';
import { Agency, User } from '@/types/types';

interface DropdownRoleProps {
  agencies: Agency[];
  setRole: (role: 'staff' | 'super_admin') => void;
  setAgency: React.Dispatch<React.SetStateAction<number | null>>;
  roleEmpty: boolean;
  user?: User;
}

const DropdownRole: React.FC<DropdownRoleProps> = ({
  agencies,
  setRole,
  setAgency,
  roleEmpty,
  user = { role: 'unassigned', agency: null },
}) => {
  const initialRole =
    user.role === 'staff' || user.role === 'super_admin'
      ? user.role
      : 'unassigned';
  const [selectedRole, setSelectedRole] = React.useState<
    'staff' | 'super_admin' | 'unassigned'
  >(initialRole);

  const handleRoleChange = (value: string) => {
    const role = value as 'staff' | 'super_admin';
    setSelectedRole(role);
    setRole(role);
  };

  const userAgency = user.agency;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="role-select">Role</Label>
        <Select onValueChange={handleRoleChange} value={selectedRole}>
          <SelectTrigger id="role-select">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem showCheckIcon={false} value="staff">
              Staff
            </SelectItem>
            <SelectItem showCheckIcon={false} value="super_admin">
              Superadmin
            </SelectItem>
          </SelectContent>
        </Select>
        {roleEmpty && selectedRole === 'unassigned' && (
          <p className="text-red-500 text-sm mt-2">Please select a role</p>
        )}
      </div>

      {selectedRole === 'staff' && (
        <div className="space-y-2">
          <Label htmlFor="agency-select">Agency</Label>
          <AgencyListDropdownUsersModal
            agencies={agencies}
            setAgency={setAgency}
            userAgency={userAgency}
          />
        </div>
      )}
    </div>
  );
};

export default DropdownRole;
