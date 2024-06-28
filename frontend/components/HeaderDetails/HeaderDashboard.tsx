import IdentifyWebsite from './IdentifyWebsite';
import ThemeToggle from './theme';
import LocaleSwitch from './locale-switch';
import Asklogo from '@/icons/asklogo';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const HeaderDashboard = ({ locale }: { locale: string }) => {
  return (
    <div className="sticky left-0 top-0 w-full">
      <div>
        <div className="bg-background flex justify-between p-2">
          <div className="font-poppins flex h-full gap-2.5 text-lg font-semibold items-center">
            <Asklogo />
            AskGovMY
            <div className="bg-zinc-800 dark:bg-black-900 rounded-md font-bold text-xs flex justify-center items-center text-background-50 w-[53px] h-[22px]">
              ADMIN
            </div>
            <Link href="/admin/dashboard/questions">
              <div className="bg-zinc-800 dark:bg-black-900 rounded-md font-bold text-xs flex justify-center items-center text-background-50 w-[53px] h-[22px]">
                Questions
              </div>
            </Link>
            <Link href="/admin/dashboard/manageagencies">
              <div className="bg-zinc-800 dark:bg-black-900 rounded-md font-bold text-xs flex justify-center items-center text-background-50 w-[53px] h-[22px]">
                ManageAgencies
              </div>
            </Link>
          </div>

          <div className="flex gap-3">
            <ThemeToggle />
            <LocaleSwitch locale={locale} />

            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>

            <div className="bg-zinc-800 dark:bg-black-900 rounded-md font-bold text-xs flex justify-center items-center text-background-50 w-[200px] h-[22px]">
              Harris Azmi Super Admin
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderDashboard;
