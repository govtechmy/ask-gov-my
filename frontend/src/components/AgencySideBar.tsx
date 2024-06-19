"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Agency {
    id: string;
    name: string;
}

interface AgencySidebarProps {
    agencies: Agency[];
}

const AGENCY = {
    "MINISTRY_OF_FINANCE": "a30895aa-0f27-46b1-b782-9a4ff919cf2d",
    "EDUCATION_MINISTRY": "ef40d294-8737-4f3a-a97b-c1ed4ce2f174",
    "TRANSPORT_MINISTRY": "d13c5167-f77d-43d6-8efc-35f2985316a3",
    "MINISTRY_OF_HEALTH": "ac051d6a-39b6-4df2-b6a6-12d64b48c780",
    "TOURISM_MINISTRY": "a43e382b-6445-43d2-bf03-eeeb74feb0c8",
};

const AgencySidebar: React.FC<AgencySidebarProps> = ({ agencies }) => {
    
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const handleAgencyClick = (name: string) => {
        const id = AGENCY[name as keyof typeof AGENCY]; // Type assertion
        router.push(`/${name}`);
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

    const filteredAgencies = agencies.filter(agency => {
        const { formattedName, acronym } = formatAgencyName(agency.name);
        return (
            formattedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            acronym.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="px-4 py-4 lg:px-10 max-w-screen-lg mx-auto">
            <div className="py-2 pb-4 font-semibold">Agency</div>
            <input
                type="text"
                placeholder="Search agencies..."
                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul className="space-y-2">
                {filteredAgencies.map(agency => {
                    const { formattedName, acronym } = formatAgencyName(agency.name);
                    return (
                        <li 
                            key={agency.id} 
                            className="p-2 cursor-pointer hover:bg-gray-200 rounded"
                            onClick={() => handleAgencyClick(agency.name)}
                        >
                            <div className="flex justify-between items-center">
                                <span className="truncate text-gray-500">{formattedName}</span>
                                <span className="ml-2 text-sm text-gray-600 truncate">{acronym}</span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default AgencySidebar;
