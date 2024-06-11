'use client'
import { useState, useEffect } from "react";
import { submitQuestion } from "@/API Services/questionServices";
import { getAgencies } from "@/API Services/AgencyServices";

interface Agency {
  id: number;
  name: string;
  slug: string;
  projectId: string;
  apiKey: string;
}

export default function QuestionCreatePage() {
  const [title, setTitle] = useState('');
  const [agency, setAgency] = useState('');
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgencies = async () => {
    try {
      const fetchedAgencies = await getAgencies();
      setAgencies(fetchedAgencies);
    } catch (error) {
      console.error("Error fetching agencies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitQuestion(agency, title);
    } catch (error) {
      console.error("Error submitting question:", error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <main className="main min-h-screen flex flex-col justify-center items-center py-8">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
          <h1 className="text-2xl font-semibold mb-4">Ask a New Question</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-gray-700">Question</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label htmlFor="agency" className="block text-gray-700">Select Agency</label>
              <select
                id="agency"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                required
              >
                <option value="" disabled>Select an agency</option>
                {agencies.map((agency) => (
                  <option key={agency.id} value={agency.name}>{agency.name}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
