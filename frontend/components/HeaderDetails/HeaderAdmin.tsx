import IdentifyWebsite from './IdentifyWebsite';
import ThemeToggle from './theme';
import LocaleSwitch from './locale-switch';
import Asklogo from '@/icons/asklogo';

const HeaderAdmin = ({ locale }: { locale: string }) => {
  return (
    <div className="sticky left-0 top-0 w-full">
      <div>
        <IdentifyWebsite />
        <div className="bg-background flex justify-between p-2">
          <div className="font-poppins flex h-full gap-2.5 text-lg font-semibold items-center">
            <Asklogo />
            AskGovMY
            <div className="bg-zinc-800 dark:bg-black-900 rounded-md font-bold text-xs flex justify-center items-center text-background-50 w-[53px] h-[22px]">
              ADMIN
            </div>
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

export default HeaderAdmin;
