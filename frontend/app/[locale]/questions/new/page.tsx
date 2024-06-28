'use client';
import { useState, useEffect } from 'react';
import { useRouter } from '@/lib/i18n';
import { submitQuestion, getAgencyList } from '@/actions/questionServices';

interface Agency {
  id: string;
  name: string;
}

const SubmitQuestionPage = () => {
  const [question, setQuestion] = useState('');
  const [agencyId, setAgencyId] = useState('');
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const router = useRouter();

  // Fetch agency list
  useEffect(() => {
    const fetchAgencies = async () => {
      const agencyList = await getAgencyList();
      setAgencies(agencyList);
    };
    fetchAgencies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (agencyId && question) {
      await submitQuestion(agencyId, question);
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
            htmlFor="agency"
            className="block text-sm font-medium text-gray-700"
          >
            Select Agency
          </label>
          <select
            id="agency"
            name="agency"
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
            value={agencyId}
            onChange={e => setAgencyId(e.target.value)}
            required
          >
            <option value="">Select an agency</option>
            {agencies.map(agency => (
              <option key={agency.id} value={agency.id}>
                {agency.name}
              </option>
            ))}
          </select>
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
