import ThemeToggle from './Theme';
import LocaleSwitch from './LocaleSwitch';
import Asklogo from '@/icons/asklogo';

const HeaderAdmin = () => {
  return (
    <div className="w-full bg-white border-[1px] border-outline-200">
      <div>
        <div className=" flex justify-between p-2">
          <div className="font-poppins flex h-full gap-2.5 text-lg font-semibold items-center">
            <Asklogo />
            <div className="hidden sm:block">AskMyGov</div>
            <div className="bg-[#27272A] dark:bg-[#F4F4F5] dark:text-[#18181B] text-[#FFFFFF] rounded-md font-bold text-xs flex justify-center items-center w-[53px] h-[22px]">
              ADMIN
            </div>
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
