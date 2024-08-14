'use client';
import Link from 'next/link';
import HeaderAdmin from '@/components/HeaderDetails/HeaderAdmin';
import FooterAdmin from '@/components/FooterDetails/FooterAdmin';
import { buttonVariants } from '@/components/ui/button';
import Maillogo from '@/icons/mail';
import Arrowleft from '@/icons/arrowleft';
import { useTranslations } from 'next-intl';
import MailLogo from '@/icons/maillogo';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function CheckmailPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations('Checkmail');
  // const { data: session } = useSession();
  const [isDisabled, setIsDisabled] = useState(true); // Initially set to true
  const [countdown, setCountdown] = useState(60); // Countdown timer in 60 seconds edit here later

  useEffect(() => {
    if (isDisabled && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (countdown === 0) {
      setIsDisabled(false);
    }
  }, [isDisabled, countdown]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isDisabled) {
      e.preventDefault();
    }
  };

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

          <div className="flex gap-3">
            <Link
              className={buttonVariants({ variant: 'tertiary', size: 'md' })}
              href="/admin"
            >
              <Arrowleft />
              {t('backclick')}
            </Link>

            {/* new implementation for resending the magic email */}
            <Link
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'md' }),
                isDisabled ? 'opacity-40 cursor-not-allowed' : '',
              )}
              href={isDisabled ? '#' : '/admin'}
              onClick={handleClick}
              aria-disabled={isDisabled}
            >
              <MailLogo />
              {isDisabled ? `Resend in ${countdown}s` : 'Resend magic link'}
            </Link>
          </div>
        </div>
      </div>
      <FooterAdmin />
    </div>
  );
}

export default CheckmailPage;
