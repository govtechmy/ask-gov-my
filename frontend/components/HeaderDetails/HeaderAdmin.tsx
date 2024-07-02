import IdentifyWebsite from './IdentifyWebsite';
import ThemeToggle from './Theme';
import LocaleSwitch from './LocaleSwitch';
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
            <div className="bg-[#27272A] dark:bg-[#F4F4F5] dark:text-[#18181B] text-[#FFFFFF] rounded-md font-bold text-xs flex justify-center items-center w-[53px] h-[22px]">
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
