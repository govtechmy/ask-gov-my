import Link from 'next/link';
import HeaderAdmin from '@/components/HeaderDetails/HeaderAdmin';
import FooterAdmin from '@/components/FooterDetails/FooterAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Google from '@/icons/google';
import { useTranslations } from 'next-intl';

export function AdminPage({ locale }: { locale: string }) {
  const t = useTranslations('Adminlogin');

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderAdmin locale={locale} />
      <div className="flex-grow flex items-center justify-center py-12">
        <div className="min-w-96">
          <div className="text-center">
            <div className="text-2xl font-semibold px-5 py-5">{t('h1')}</div>
            <div className="text-base pb-6 text-zinc-700 dark:text-[#D4D4D8]">
              {t('para1')}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2 pb-4">
              <div className="text-zinc-500 text-sm">{t('email')}</div>
              <Input
                id="email"
                type="email"
                placeholder="yourname@example.com"
                required
              />
            </div>

            <Button
              type="submit"
              className="text-base font-medium text-white rounded-md py-2 from-[#702FF9] to-[#B379FF] dark:from-[#702FF9] dark:to-[#B379FF] border-[1px] border-[#702FF9]"
            >
              {t('1stbutton')}
            </Button>

            <div className="text-center font-normal text-zinc-500 text-sm">
              {t('or')}
            </div>

            <Button className="flex justify-center py-2 rounded-md from-[#FFF] to-[#FFF] dark:from-[#18181B] dark:to-[#18181B] border-[1px] border-[#E4E4E7] dark:border-[#27272A]">
              <Google />
              <div className="px-2 font-medium text-base">{t('2ndbutton')}</div>
            </Button>
          </div>

          <div className="mt-4 text-center pt-4">
            <Link
              href="/forgot-password"
              className="ml-auto font-normal text-[#2563EB] inline-block text-sm"
            >
              {t('forgotpass')}
            </Link>
          </div>
        </div>
      </div>

      <FooterAdmin />
    </div>
  );
}

export default AdminPage;
