'use client';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Google from '@/icons/google';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { checkUserEmailExists } from '@/actions/userServices';

export function LoginForm() {
  const t = useTranslations('Adminlogin');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const emailExists = await checkUserEmailExists(email);
      if (emailExists) {
        const result = await signIn('email', {
          email,
          callbackUrl: '/admin/dashboard',
          redirect: true,
        });
        if (result?.ok) {
          redirect('/admin/checkmail');
        } else {
          console.error('Sign in failure');
        }
      } else {
        setErrorMsg(
          'Your account does not exist. Please contact your admin to request an invitation.',
        );
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/admin/dashboard' });
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
                {errorMsg && (
                  <p className=" text-danger-600 font-normal text-base sm:max-w-[339px] w-max-[400px]">
                    {errorMsg}
                  </p>
                )}
              </div>

              {isLoading ? (
                <Button
                  variant={'primary'}
                  disabled={true}
                  className="opacity-100"
                >
                  {t('1stbutton')}
                </Button>
              ) : (
                <Button variant={'primary'}> {t('1stbutton')}</Button>
              )}

              <div className="text-center font-normal text-zinc-500 text-sm">
                {t('or')}
              </div>

              <Button variant={'secondary'} onClick={handleGoogleSignIn}>
                <Google></Google> {t('2ndbutton')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
