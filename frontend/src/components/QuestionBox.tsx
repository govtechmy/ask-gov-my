import Link from "next/link";

const questions = [
  "What is the process for renewing a driver's license?",
  "How can I apply for a government grant?",
  "Where can I find information on local government services?",
  "What are the new regulations for small businesses?",
  "How do I report a pothole in my area?"
]; // hardcoded data

export default function QuestionBox() {
  return (
    <div className="questionBox border border-gray-300 p-6 rounded-lg bg-white shadow-md">
      <h2 className="text-2xl font-semibold mb-4"></h2>
      <ul className="list-disc list-inside space-y-2">
        {questions.map((question, index) => (
          <li key={index}>
            <Link href={`/questions/${index}`}>
              <p className="text-blue-600 hover:underline">{question}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


