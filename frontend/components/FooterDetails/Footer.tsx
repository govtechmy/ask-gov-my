import Image from 'next/image';
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('Footer');

  return (
    <div className="bg-white px-6 pb-16 pt-12 lg:px-8">
      <div className="gap-4.5 flex flex-col justify-between sm:flex-row">
        <div className="flex items-center gap-x-2.5">
          <Image
            src="/jata_logo.png"
            width={48}
            height={36}
            alt="Logo Jata Negara"
          />
          <div>
            <p className="font-poppins whitespace-nowrap font-semibold">
              {t('gov_mys')}
            </p>
            <p className="text-xs text-zinc-500">
              © {new Date().getFullYear()} {t('gov_mys')}
            </p>
          </div>
        </div>
        <div className="gap-4.5 flex flex-col sm:flex-row">
          <a
            href="#"
            className="text-sm text-zinc-500 [text-underline-position:from-font] hover:text-black hover:underline dark:hover:text-white"
          >
            {t('api_docs')}
          </a>
          <a
            href="/admin"
            className="text-sm text-zinc-500 [text-underline-position:from-font] hover:text-black hover:underline dark:hover:text-white"
          >
            {t('admin_login')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
