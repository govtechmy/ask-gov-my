import Head from 'next/head';
import QuestionBox from '@/components/QuestionBox';

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>Government Q&A</title>
        <meta name="description" content="Ask questions to the government" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main min-h-screen flex flex-col justify-center items-center py-8">
        <h1 className="text-4xl font-bold mb-6">
          Welcome to Government Q&A
        </h1>
        <QuestionBox />
      </main>
    </div>
  );
  }


