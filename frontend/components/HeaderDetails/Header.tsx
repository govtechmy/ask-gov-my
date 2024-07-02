import IdentifyWebsite from './IdentifyWebsite';
import ThemeToggle from './Theme';
import LocaleSwitch from './LocaleSwitch';
import Asklogo from '@/icons/asklogo';

const Header = () => {
  return (
    <div className="sticky left-0 top-0 w-full">
      <div>
        <IdentifyWebsite />
        <div className="bg-background flex justify-between p-2">
          <div className="font-poppins flex h-full gap-2.5 text-lg font-semibold items-center">
            <Asklogo />
            AskGovMY
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
