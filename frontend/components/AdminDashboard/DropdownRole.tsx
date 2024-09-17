import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Agency, User } from '@/types/types';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { AgencySearchList } from './AgencySearchList';
import ChevronDown from '@/icons/ChevronDown';

interface DropdownRoleProps {
  agencies: Agency[];
  setRole: (role: 'staff' | 'super_admin' | 'unassigned') => void;
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
  const [openAgencyPopover, setOpenAgencyPopover] = useState(false);

  const initialRole =
    user.role === 'staff' || user.role === 'super_admin'
      ? user.role
      : 'unassigned';
  const [selectedRole, setSelectedRole] = React.useState<
    'staff' | 'super_admin' | 'unassigned'
  >(initialRole);

  const handleRoleChange = (value: string) => {
    const role = value as 'staff' | 'super_admin' | 'unassigned';
    setSelectedRole(role);
    setRole(role);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="role-select">Role</Label>
        <Select onValueChange={handleRoleChange} value={selectedRole}>
          <SelectTrigger id="role-select">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem showCheckIcon={false} value="unassigned">
              Unassigned
            </SelectItem>
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
          <Popover open={openAgencyPopover} onOpenChange={setOpenAgencyPopover}>
            <PopoverTrigger asChild>
              <Button className="w-full h-10 text-sm font-normal">
                {user.agency || 'Unassigned'}
                <ChevronDown className="ml-auto h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 rounded-[14px] md:min-w-[320px]"
              align="start"
            >
              <AgencySearchList
                agencies={agencies}
                onSelect={async agency => {
                  setOpenAgencyPopover(false);
                  if (!agency) {
                    setAgency(null);
                    return;
                  }
                  setAgency(agency.id);
                }}
                nullItemLabel="Unassigned"
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default DropdownRole;
