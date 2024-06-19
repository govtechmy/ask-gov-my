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

const AGENCY_NAME_TO_ID = {
    "MINISTRY_OF_FINANCE": "a30895aa-0f27-46b1-b782-9a4ff919cf2d",
    "EDUCATION_MINISTRY": "ef40d294-8737-4f3a-a97b-c1ed4ce2f174",
    "TRANSPORT_MINISTRY": "d13c5167-f77d-43d6-8efc-35f2985316a3",
    "MINISTRY_OF_HEALTH": "ac051d6a-39b6-4df2-b6a6-12d64b48c780",
    "TOURISM_MINISTRY": "a43e382b-6445-43d2-bf03-eeeb74feb0c8",
};

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
        const words = name.split('_');
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
        const agencyId = AGENCY_NAME_TO_ID[question.agency];
        if (agencyId) {
            router.push(`/${formattedName}/${question.id}`);
        } else {
            console.error(`Agency ID not found for agency: ${question.agency}`);
        }
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
