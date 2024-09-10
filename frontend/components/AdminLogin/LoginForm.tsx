'use client';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BaseHeader from '@/components/common/Header/BaseHeader';
import Google from '@/icons/google';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { checkUserEmailExists } from '@/actions/userServices';
import Toast from '../ui/toast';
import TickCheckCircle from '@/icons/tickcheckcircle';
import X from '@/icons/x';

export function LoginForm() {
  const t = useTranslations('Adminlogin');
  const [email, setEmail] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
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
          setToastMsg('Sign in failure');
          setShowToast(true);
        }
      } else {
        console.log('email not found');
        setToastMsg('Email not found');
        setShowToast(true);
      }
    } catch {
      setToastMsg('Error. Please contact the admin.');
      setShowToast(true);
    }
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
          {showToast && (
            <Toast
              message={toastMsg}
              icon={<X />}
              underlineColor="bg-[#16A34A]"
              messageColor="text-[#15803D] dark:text-[#16A34A]"
              show={showToast}
              onClose={() => {
                setShowToast(false);
                setToastMsg('');
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
