import IdentifyWebsite from './IdentifyWebsite';
import ThemeToggle from './theme';
import LocaleSwitch from './locale-switch';
import Asklogo from '@/icons/asklogo';

const Header = ({ locale }: { locale: string }) => {
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
            <LocaleSwitch locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
