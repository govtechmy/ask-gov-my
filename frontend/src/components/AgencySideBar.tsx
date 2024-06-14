"use client"
import { useRouter } from 'next/navigation';
import React from 'react';

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

    const formatAgencyName = (name: string) => {
        const words = name.split(' ');
        const acronym = words.map(word => word.charAt(0).toUpperCase()).join('');
        
        const formattedName = name.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });

        return { formattedName, acronym };
    };

    return (
        <div className="px-4 py-4 lg:px-10 lg:py-10 max-w-screen-lg mx-auto">
            <ul className="space-y-2">
                {agencies.map(agency => {
                    const { formattedName, acronym } = formatAgencyName(agency.name);
                    return (
                        <li 
                            key={agency.id} 
                            className="p-2 cursor-pointer hover:bg-gray-200 rounded"
                            onClick={() => handleAgencyClick(agency.id)}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium truncate">{formattedName}</span>
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
