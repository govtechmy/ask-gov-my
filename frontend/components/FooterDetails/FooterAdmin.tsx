import Image from 'next/image';
import { useTranslations } from 'next-intl';

const FooterAdmin = () => {
  const t = useTranslations('Footer');

  return (
    <div className="bg-white border-y">
      <div className="container justify-center mx-auto">
        <div className="justify-between px-8 py-6  sm:py-3 sm:flex">
          <div className="flex items-center">
            <div className="h-[30px] w-[30px]">
              <Image
                src="/jata_logo.png"
                width={96}
                height={96}
                alt="Logo Jata Negara"
              />
            </div>
            <div className="sm:flex items-center">
              <p className="font-poppins whitespace-nowrap font-semibold text-sm pl-[10px]">
                {t('gov_mys')}
              </p>
              <p className="text-xs text-zinc-500 font-normal px-2 hidden sm:block">
                © {new Date().getFullYear()} {t('gov_mys')}
              </p>
            </div>
          </div>
          <div className="flex items-center py-3">
            <a
              href="#"
              className="text-sm text-black-700 [text-underline-position:from-font] hover:text-black hover:underline dark:hover:text-white"
            >
              {t('Home')}
            </a>
            <a
              href="#"
              className="text-sm text-black-700 [text-underline-position:from-font] hover:text-black hover:underline dark:hover:text-white pl-5"
            >
              {t('api_docs')}
            </a>
          </div>
          <div className="text-xs text-zinc-500 font-normal md:hidden pt-3">
            © {new Date().getFullYear()} {t('gov_mys')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterAdmin;
