import Image from "next/image";

interface Question {
    id: string;
    name: string;
    description_html: string;
    agency: string;
    createdAt: string;
}

interface QuestionCardProps {
    question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
    const truncateDescription = (description: string, maxWords: number) => {
        const words = description.replace(/<\/?[^>]+(>|$)/g, "").split(' ');
        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(' ') + '...';
        }
        return description;
    };

    return (
        <div className="border p-4 rounded-md shadow-sm">
            <h2 className="text-lg font-semibold">{question.name}</h2>
            <div className="mt-2 text-sm" dangerouslySetInnerHTML={{ __html: truncateDescription(question.description_html, 30) }} />
            <div className="flex items-center mt-4">
            <Image 
            src="/jata_logo.png" 
            alt="Logo Jata Negara" 
            width={30}
            height={30}/>
            <span className="text-gray-600">{question.agency}</span>
                <span className="ml-auto text-gray-400 text-xs">{new Date(question.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    );
};

export default QuestionCard;