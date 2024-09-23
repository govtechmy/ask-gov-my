'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname, useRouter } from '@/lib/i18n';
import { useParams, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export default function LocaleSwitch() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const onSelectChange = (locale: string) => {
    startTransition(() => {
      router.replace(`${pathname}?${searchParams}`, {
        locale,
        scroll: false,
      });
    });
  };

  return (
    <Tabs
      defaultValue="en"
      value={params.locale as string}
      onValueChange={onSelectChange}
    >
      <TabsList className="bg-washed-100 dark:bg-[#1D1D21] h-8 gap-0 rounded-lg">
        {['ms', 'en'].map(locale => (
          <TabsTrigger
            key={locale}
            className="text-dim-500 h-full rounded-lg border 
            data-[state=active]:border-outline-200 data-[state=active]:bg-[#FFFFFF]  dark:data-[state=active]:bg-[#27272A] data-[state=active]:shadow-none
            data-[state=inactive]:border-transparent"
            value={locale}
          >
            {locale === 'en' ? 'ENG' : 'BM'}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
