import Image from "next/image";
import { useTranslations } from "next-intl";

const FooterAdmin = () => {
  const t = useTranslations("Footer");

  return (
    <div className="px-6 lg:px-8">
      <div className="gap-4.5 flex flex-col justify-between sm:flex-row pb-6">
        <div className="flex items-center gap-x-2.5">
          <Image
            src="/jata_logo.png"
            width={48}
            height={36}
            alt="Logo Jata Negara"
          />
          <div className="flex items-center">
            <p className="font-poppins whitespace-nowrap font-semibold">
              {t("gov_mys")}
            </p>
            <p className="text-xs text-zinc-500">
              © {new Date().getFullYear()} {t("gov_mys")}
            </p>
          </div>
        </div>
        <div className="gap-4.5 flex flex-col sm:flex-row items-center">
          <a
            href="#"
            className="text-sm text-zinc-500 [text-underline-position:from-font] hover:text-black hover:underline dark:hover:text-white"
          >
            {t("Home")}
          </a>
          <a
            href="#"
            className="text-sm text-zinc-500 [text-underline-position:from-font] hover:text-black hover:underline dark:hover:text-white"
          >
            {t("api_docs")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterAdmin;
