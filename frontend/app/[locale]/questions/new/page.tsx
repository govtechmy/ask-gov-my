'use client';
import { useState } from 'react';
import { useRouter } from '@/lib/i18n';
import { submitQuestion } from '@/actions/questionServices';

const SubmitQuestionPage = () => {
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (question && email) {
      await submitQuestion({ question, email });
      router.push('/');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Submit a New Question</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="question"
            className="block text-sm font-medium text-gray-700"
          >
            Question
          </label>
          <textarea
            id="question"
            name="question"
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            required
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600"
        >
          Submit Question
        </button>
      </form>
    </div>
  );
};

export default SubmitQuestionPage;
