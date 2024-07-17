import Link from 'next/link';
import HeaderAdmin from '@/components/HeaderDetails/HeaderAdmin';
import FooterAdmin from '@/components/FooterDetails/FooterAdmin';
import { Button } from '@/components/ui/button';
import Maillogo from '@/icons/mail';
import Arrowleft from '@/icons/arrowleft';
import { useTranslations } from 'next-intl';

export function CheckmailPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations('Checkmail');
  // const { data: session } = useSession();

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderAdmin />
      <div className="flex-grow flex items-center justify-center py-12">
        <div className="flex flex-col items-center justify-center">
          <Maillogo />
          <div className="font-semibold text-2xl py-4">{t('checkmail')}</div>
          <div className="font-normal text-base text-zinc-700 dark:text-zinc-300">
            {t('para1')}
          </div>

          <div className="flex pb-6">
            <div className="font-medium text-base px-1">
              {/* {session?.user?.email || 'yourname@example.com'} */}
            </div>
            <div className="font-normal text-base text-zinc-700 dark:text-zinc-300">
              {t('para2')}
            </div>
          </div>

          <Link href="/admin">
            <Button
              className="
              flex justify-center items-center py-2 rounded-md
              from-[#FFF] to-[#FFF]  dark:from-[#18181B] dark:to-[#18181B] 
              border-[1px] border-[#E4E4E7] dark:border-[#27272A]
              hover:cursor-pointer
              "
            >
              <div className="px-3">
                <Arrowleft />
              </div>
              <div className="pr-3 font-medium text-base ">
                {t('backclick')}
              </div>
            </Button>
          </Link>
        </div>
      </div>
      <FooterAdmin />
    </div>
  );
}

export default CheckmailPage;
