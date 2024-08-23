'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import Google from '@/icons/google';
import Footer from '@/components/common/Footer';
import BaseHeader from '@/components/common/Header/BaseHeader';

export function AdminPage() {
  const t = useTranslations('Adminlogin');
  const [email, setEmail] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertFailed, setAlertFailed] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    // When login button is clicked
    // Let's check if this user exists in the User Table
    // fetch("/api/auth/account-exists", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email }),
    // }).then(async (res) => {
    //   const { exists } = await res.json();

    // if (exists) {
    await signIn('email', {
      email,
      callbackUrl: '/admin/dashboard',
      redirect: true,
    }).then(res => {
      setAlertSuccess(true);
    });
    // } else {
    // Bagitau dekat UI error message: Account tidak wujud
    // toast.error(message?.no_account);
    // setNoSuchAccount(true);
    // setClickedEmail(false);
    // }

    // })
  };

  return (
    <>
      <div className="flex-grow flex items-center justify-center py-12">
        <div className="max-w-[450px]">
          <div className="text-center">
            <div className="text-2xl font-semibold px-5 py-5">{t('h1')}</div>
            <div className="text-base pb-6 text-zinc-700 dark:text-[#D4D4D8]">
              {t('para1')}
            </div>
          </div>
          {/* {alertSuccess == true ? <div>
            <div className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
  <span className="font-medium">Info alert!</span> Change a few things up and try submitting again.
</div>

          </div> : <div></div>} */}

          <form onSubmit={handleSignIn}>
            <div className="grid gap-4">
              <div className="grid gap-2 pb-4">
                <div className="text-zinc-500 text-sm">{t('email')}</div>
                <Input
                  className="sm:max-w-[339px] w-max-[400px] bg-white shadow-button"
                  id="email"
                  type="email"
                  placeholder="officer@agency.gov.my"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <Button variant={'primary'}> {t('1stbutton')}</Button>

              <div className="text-center font-normal text-zinc-500 text-sm">
                {t('or')}
              </div>

              <Button variant={'secondary'}>
                <Google></Google> {t('2ndbutton')}
              </Button>
            </div>
          </form>

          <div className="text-center pt-2">
            <Link
              className={buttonVariants({
                variant: 'tertiary-colour',
                size: 'sm',
              })}
              href="/forgot-password"
            >
              {t('forgotpass')}
            </Link>
          </div>
        </div>
      </div>
      <Footer adminpage={true} />
    </>
  );
}

export default AdminPage;
