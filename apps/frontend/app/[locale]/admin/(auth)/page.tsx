'use client';

import { LoginForm } from '@/components/AdminLogin/LoginForm';
import Footer from '@/components/common/Footer';

export function AdminPage() {
  return (
    <>
      <LoginForm />
      <Footer adminpage={true} />
    </>
  );
}

export default AdminPage;
