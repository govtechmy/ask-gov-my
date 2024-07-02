import ThemeToggle from './Theme';
import LocaleSwitch from './LocaleSwitch';
import { Link } from '@/lib/i18n';
import Asklogo from '@/icons/asklogo';

const ClickHomeLogo = () => {
  return (
    <div className="bg-background flex justify-between p-3">
      <Link
        href="/"
        className="font-poppins flex h-full gap-2.5 text-lg font-semibold"
      >
        <Asklogo />
        AskGovMY
      </Link>

      <div className="flex gap-3">
        <ThemeToggle />
        <LocaleSwitch />
      </div>
    </div>
  );
};

export default ClickHomeLogo;
