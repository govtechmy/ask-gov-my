"use client";
import { useRouter } from "next/navigation";

interface Question {
    id: string;
    name: string;
    description_html: string;
    agency: string;
    createdAt: string;
    agencyId: string;
}

interface QuestionCardProps {
    question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
    const router = useRouter();

    const truncateDescription = (description: string, maxWords: number) => {
        const words = description.replace(/<\/?[^>]+(>|$)/g, "").split(' ');
        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(' ') + '...';
        }
        return description;
    };

    const formatAgencyName = (name: string) => {
        const words = name.split(' ');
        const acronym = words.map(word => word.charAt(0).toUpperCase()).join('');
    
        const formattedName = words.map(word => {
            if (word.toLowerCase() === 'of') {
                return 'of';
            }
            return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
        }).join(' ');
    
        return { formattedName, acronym };
    };

    const { formattedName } = formatAgencyName(question.agency);

    const handleClick = () => {
        router.push(`/${question.agencyId}/${question.id}`);
    };

    return (
        <div className="border p-4 rounded-md shadow-sm items-center cursor-pointer" onClick={handleClick}>
            <h2 className="text-lg font-semibold">{question.name}</h2>
            <div className="mt-2 text-sm" dangerouslySetInnerHTML={{ __html: truncateDescription(question.description_html, 30) }} />
            <div className="flex items-center mt-4">
                <span className="text-gray-600">{formattedName}</span>
                <span className="ml-auto text-gray-400 text-xs">{new Date(question.createdAt).toLocaleDateString('en-GB')}</span>
            </div>
        </div>
    );
};

export default QuestionCard;
