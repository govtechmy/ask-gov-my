'use client'
import { useParams } from "next/navigation";
import Link from "next/link";

const questions = [
    {
      id: 0,
      text: "What is the process for renewing a driver's license?",
      replies: [
        { id: 1, text: "You need to visit the DMV office with your current license, fill out a renewal form, and pay the renewal fee." },
      ]
    },
    {
      id: 1,
      text: "How can I apply for a government grant?",
      replies: [
        { id: 1, text: "You can apply for a government grant by visiting the grants.gov website and searching for available grants." },
      ]
    },
    {
      id: 2,
      text: "Where can I find information on local government services?",
      replies: [
        { id: 1, text: "You can find information on local government services by visiting your city's official website." },
      ]
    },
    {
      id: 3,
      text: "What are the new regulations for small businesses?",
      replies: [
        { id: 1, text: "The new regulations for small businesses can be found on the Small Business Administration (SBA) website." },
      ]
    },
    {
      id: 4,
      text: "How do I report a pothole in my area?",
      replies: [
        { id: 1, text: "You can report a pothole by calling your local public works department." },
      ]
    }
  ]; // hardcoded data to be displayed in the QuestionShowPage(initial test)

  export default function QuestionShowPage() {
    const { id } = useParams();
  const questionId = parseInt(id as string, 10);
  const question = questions.find(q => q.id === questionId);

  if (!question) {
    return <p>Question not found.</p>;
  }

  return (
    <div className="container mx-auto px-4">
      <main className="main min-h-screen flex flex-col justify-center items-center py-8">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
          <h1 className="text-2xl font-semibold mb-4">{question.text}</h1>
          <div className="space-y-4">
            {question.replies.map(reply => (
              <div key={reply.id} className="bg-gray-100 p-4 rounded">
                {reply.text}
              </div>
            ))}
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => window.history.back()}>
            Go Back
          </button>
          <button>
          <Link href="/questions/new">
          <p className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Ask a New Question
          </p>
        </Link>
        </button>
        </div>
      </main>
    </div>
  );
} // to be refactor after API integration