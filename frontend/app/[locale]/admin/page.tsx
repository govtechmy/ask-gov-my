'use client'
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import HeaderAdmin from '@/components/HeaderDetails/HeaderAdmin';
import FooterAdmin from '@/components/FooterDetails/FooterAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import IdentifyWebsite from '@/components/HeaderDetails/IdentifyWebsite';

export function AdminPage() {
  const t = useTranslations('Adminlogin');
  const [email, setEmail] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn('email', {
      email,
      callbackUrl: '/admin/dashboard',
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <IdentifyWebsite />
      <div className="bg-white">
        <HeaderAdmin />
      </div>
      <div className="flex-grow flex items-center justify-center py-12">
        <div className="min-w-96">
          <div className="text-center">
            <div className="text-2xl font-semibold px-5 py-5">{t('h1')}</div>
            <div className="text-base pb-6 text-zinc-700 dark:text-[#D4D4D8]">
              {t('para1')}
            </div>
          </div>

          <form onSubmit={handleSignIn}>
            <div className="grid gap-4">
              <div className="grid gap-2 pb-4">
                <div className="text-zinc-500 text-sm">{t('email')}</div>
                <Input
                  id="email"
                  type="email"
                  placeholder="yourname@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="text-base font-medium text-white rounded-md py-2 from-[#702FF9] to-[#B379FF] dark:from-[#702FF9] dark:to-[#B379FF] border-[1px] border-[#702FF9]"
              >
                {t('1stbutton')}
              </Button>
            </div>
          </form>

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

      <div className="bg-white pt-3">
        <FooterAdmin />
      </div>
    </div>
  );
}

export default AdminPage;