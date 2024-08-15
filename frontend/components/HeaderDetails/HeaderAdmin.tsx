import ThemeToggle from './theme';
import LocaleSwitch from './LocaleSwitch';
import Asklogo from '@/icons/asklogo';
import { StyledDisplay } from '../ui/display';

const HeaderAdmin = () => {
  return (
    <div className="w-full bg-white border-[1px] border-outline-200">
      <div>
        <div className=" flex justify-between p-2">
          <div className="font-poppins flex h-full gap-2.5 text-lg font-semibold items-center">
            <Asklogo />
            <div className="hidden sm:block">AskMyGov</div>
            <StyledDisplay variant={'nameHeader'}>ADMIN</StyledDisplay>
          </div>
          <div className="flex gap-3">
            <ThemeToggle />
            <LocaleSwitch />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderAdmin;
