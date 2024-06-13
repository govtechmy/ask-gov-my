"use client";
import { useRouter } from 'next/navigation';
// initial basic sidebar first then implement scroll and search input feature
interface Agency {
    id: string;
    name: string;
}

interface AgencySidebarProps {
    agencies: Agency[];
}

const AgencySidebar: React.FC<AgencySidebarProps> = ({ agencies }) => {
    const router = useRouter();

    const handleAgencyClick = (id: string) => {
        router.push(`/${id}`);
    };

    return (
        <div className="w-64 bg-gray-100 p-4 border-r border-gray-300">
            <ul className="space-y-2">
                {agencies.map(agency => (
                    <li 
                        key={agency.id} 
                        className="p-2 cursor-pointer hover:bg-gray-200 rounded"
                        onClick={() => handleAgencyClick(agency.id)}
                    >
                        {agency.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AgencySidebar;