import ThemeToggle from './Theme';
import LocaleSwitch from './LocaleSwitch';
import Asklogo from '@/icons/asklogo';

const Header = () => {
  return (
    <div className="w-full bg-white p-2 border-[1px] border-outline-200">
      <div className="container flex mx-auto">
        <div className="flex justify-between w-full">
          <div className="font-poppins flex h-full gap-2.5 text-lg font-semibold items-center">
            <Asklogo />
            AskMyGov
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

export default Header;
