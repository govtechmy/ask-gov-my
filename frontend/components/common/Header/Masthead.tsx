'use client';

import { usePathname } from 'next/navigation';
import Collapse from '@/components/ui/collapse';
import TickWithRugged from '@/icons/tickwithrugged';
import ChevronDown from '@/icons/ChevronDown';
import PutrajayaIcon from '@/icons/putrajaya';
import EncryptedLock from '@/icons/encryptedlock';
import SolidLock from '@/icons/solidlock';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function Masthead() {
  const pathname = usePathname();
  const t = useTranslations('Masthead');
  const [open, setOpen] = useState(false);

  // Return null if pathname includes '/admin'
  if (pathname.includes('/admin')) {
    return null;
  }

  return (
    <div
      className={cn(
        'z-[99]',
        open
          ? 'bg-gradient-to-b from-washed-100 from-[84.74%] to-outline-200 to-100%'
          : 'bg-washed-100',
      )}
    >
      <div className="container">
        <button className="w-full" onClick={() => setOpen(!open)}>
          <div className="flex flex-wrap items-center gap-1.5 py-2.5 text-sm/4 text-[#1D4ED8] dark:text-[#588BFB] max-sm:justify-between sm:py-1">
            <div className="flex items-center gap-1.5">
              <TickWithRugged className="size-4 sm:size-5 stroke-[#1D4ED8] dark:stroke-[#588BFB]" />
              <span className="text-black-700">
                {t('official_gov_website')}
              </span>
            </div>
            <div className="flex items-center gap-0.5 max-sm:rounded-md max-sm:bg-outline-200 max-sm:px-1">
              <span className="hidden tracking-[-0.01em] sm:block">
                {t('how_to_identify')}
              </span>
              <ChevronDown
                className={cn('size-4 transition', open ? 'rotate-180' : '')}
              />
            </div>
          </div>
        </button>
        <Collapse isOpen={open}>
          <div className="grid grid-cols-1 gap-4.5 pb-6 pt-4.5 sm:grid-cols-2 sm:gap-6 sm:pb-8 sm:pt-6">
            <span className="static text-sm text-[#1D4ED8] dark:text-[#588BFB] sm:hidden">
              {t('how_to_identify')}
            </span>
            <div className="flex gap-3">
              <PutrajayaIcon className="shrink-0 text-dim-500" />
              <div className="space-y-1.5">
                <p className="font-medium max-sm:text-sm">{t('official')}</p>
                <p className="max-w-prose text-balance text-sm text-black-700">
                  {t('not_govmy')}
                  <span className="font-semibold">.gov.my</span>
                  {t('close_site')}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <EncryptedLock className="shrink-0 text-dim-500" />
              <div className="space-y-1.5">
                <p className="font-medium max-sm:text-sm">{t('secure')}</p>
                <div className="max-w-prose text-balance text-sm text-black-700">
                  {t('find_lock')}{' '}
                  <SolidLock className="-ml-[3px] mb-0.5 mr-px inline size-3.5" />
                  {t('or')}
                  <span className="font-semibold">https://</span>
                  {t('precaution')}
                </div>
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    </div>
  );
}
