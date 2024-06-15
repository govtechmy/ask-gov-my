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

const AgencySidebar: React.FC<AgencySidebarProps> = ({ agencies }) => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const handleAgencyClick = (id: string) => {
        router.push(`/${id}`);
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
                            onClick={() => handleAgencyClick(agency.id)}
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
