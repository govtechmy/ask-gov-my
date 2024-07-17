'use client';

import { useTranslations } from 'next-intl';
import HeaderDashboard from '@/components/HeaderDetails/HeaderDashboard';
import QuestionNavbar from '@/components/AdminDashboard/QuestionNavbar';
import { useSession } from 'next-auth/react';
import { useRouter } from '@/lib/i18n';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getAllUserQuestions } from '@/actions/userServices';
import AdminQuestionBox from '@/components/AdminDashboard/AdminQuestionBox';

interface Question {
  id: number;
  question: string;
  date: string;
  state: string;
  agency: number;
  answer: string;
  topics: number[];
  email: string;
  likes: number;
  dislikes: number;
  attachment: string[];
  isopen: boolean;
}

export default function DashboardPage() {
  const t = useTranslations('Adminlogin');
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'all';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (session.status !== 'authenticated') {
        try {
          const { questions } = await getAllUserQuestions();
          setQuestions(questions);
        } catch (error) {
          if (error instanceof Error) {
            console.log(error.message);
            setError(error.message);
          } else {
            console.log('An unknown error occurred');
            setError('An unknown error occurred');
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuestions();
  }, [session]);

  if (session.status === 'loading') {
    return <p>LOADING...</p>;
  }

  // if (session.status !== 'authenticated') {
  //   router.push('/admin');
  //   return <p>goodbye</p>;
  // }

  if (loading) {
    return <p>Loading questions...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex flex-col min-h-screen pt-5">
      <div className="mx-[10%]">
        <HeaderDashboard />
        <QuestionNavbar />
        <div className="flex-grow flex items-center justify-center py-12">
          <AdminQuestionBox questions={questions} />
        </div>
      </div>
    </div>
  );
}
