'use client';

import { LoginForm } from '@/components/AdminLogin/LoginForm';
import Footer from '@/components/common/Footer';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export function AdminPage() {
  const { data: session, status } = useSession();

  if (session?.user) {
    redirect('/admin/dashboard');
  }

  return (
    <>
      <LoginForm />
      <Footer adminpage={true} />
    </>
  );
}

export default AdminPage;
