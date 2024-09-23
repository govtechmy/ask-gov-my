import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface FooterProps {
  adminpage?: boolean;
}

const Footer: React.FC<FooterProps> = ({ adminpage = false }) => {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();

  const Logo: React.FC<{ size: number }> = ({ size }) => (
    <Image
      src="/jata_logo.png"
      width={size}
      height={size}
      alt="Logo Jata Negara"
    />
  );

  const Copyright: React.FC = () => (
    <p className="text-xs text-zinc-500 font-normal">
      © {currentYear} {t('gov_mys')}
    </p>
  );

  const Links: React.FC = () => (
    <div>
      <a
        href="#"
        className="text-sm text-black-700 hover:text-black hover:underline"
      >
        {adminpage ? t('Home') : t('api_docs')}
      </a>
      <a
        href={adminpage ? '#' : '/admin'}
        className="text-sm text-black-700 hover:text-black hover:underline pl-5"
      >
        {adminpage ? t('api_docs') : t('admin_login')}
      </a>
    </div>
  );

  if (adminpage) {
    return (
      <div className="justify-between px-8 py-6 sm:py-3 sm:flex">
        <div className="items-center py-3 gap-4.5 sm:hidden ">
          <Links />
        </div>
        <div className="flex items-center">
          <div className="h-[30px] w-[30px] flex-shrink-0">
            <Logo size={96} />
          </div>
          <p className="font-poppins whitespace-nowrap font-semibold text-sm pl-[10px]">
            {t('gov_mys')}
          </p>
          <span className="px-2 hidden sm:block">
            <Copyright />
          </span>
        </div>

        <div className=" items-center py-3 gap-4.5 hidden sm:block">
          <Links />
        </div>
        <div className="pt-3 sm:hidden">
          <Copyright />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-t">
      <div className="container justify-center mx-auto">
        <div className="gap-4.5 flex flex-col justify-between sm:flex-row px-6 pb-16 pt-12 lg:px-8">
          <div className="flex items-center gap-x-2.5">
            <Logo size={48} />
            <div>
              <p className="font-poppins whitespace-nowrap font-semibold">
                {t('gov_mys')}
              </p>
              <Copyright />
            </div>
          </div>
          <div className="gap-4.5 flex flex-col sm:flex-row">
            <Links />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
