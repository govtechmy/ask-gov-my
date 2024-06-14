import { getAllQuestions } from '@/API Services/questionServices';
import QuestionBox from '@/components/QuestionBox/QuestionBox';
import AgencySidebar from '@/components/AgencySideBar';
import { getAgencyList } from '@/API Services/questionServices';

const MainPage = async ({ searchParams }: { searchParams: { page?: string } }) => {
    const page = parseInt(searchParams.page || '1', 10);
    const pageSize = 10;
    const { questions, total } = await getAllQuestions(page, pageSize);
    const totalPages = Math.ceil(total / pageSize);
    const agencies = await getAgencyList();

    return (
        <div className="container max-w-full">
            <div className="flex mt-4">
                <div className="w-1/4">
                    <AgencySidebar agencies={agencies} />
                </div>
                <div className="w-3/4">
                    <QuestionBox questions={questions} totalPages={totalPages} currentPage={page} />
                </div>
            </div>
        </div>
    );
};

export default MainPage;


// "use client";
// import { useRouter } from 'next/navigation';
// // initial basic sidebar first then implement scroll and search input feature
// interface Agency {
//     id: string;
//     name: string;
// }

// interface AgencySidebarProps {
//     agencies: Agency[];
// }

// const AgencySidebar: React.FC<AgencySidebarProps> = ({ agencies }) => {
//     const router = useRouter();

//     const handleAgencyClick = (id: string) => {
//         router.push(`/${id}`);
//     };

//     return (
//         <div className="w-64 bg-gray-100 p-4 border-r border-gray-300">
//             <ul className="space-y-2">
//                 {agencies.map(agency => (
//                     <li 
//                         key={agency.id} 
//                         className="p-2 cursor-pointer hover:bg-gray-200 rounded"
//                         onClick={() => handleAgencyClick(agency.id)}
//                     >
//                         {agency.name}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default AgencySidebar;

// "use client"
// import React from 'react';
// import { useRouter } from 'next/navigation';

// interface Agency {
//     id: string;
//     name: string;
//     acronym: string;
//     notifications: number;
// }

// interface AgencySidebarProps {
//     agencies: Agency[];
// }

// const AgencySidebar: React.FC<AgencySidebarProps> = ({ agencies }) => {
//     const router = useRouter();

//     const handleAgencyClick = (id: string) => {
//         router.push(`/${id}`);
//     };

//     const toTitleCase = (str: string) => {
//         return str.replace(/\w\S*/g, function(txt) {
//             return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//         });
//     };

//     // Ensure useRouter() is used in a client-side context
//     if (typeof window === 'undefined') {
//         return null; // Return null or loading indicator if SSR
//     }

//     return (
//         <div className="px-6">
//             <div className='font-medium truncate px-6 py-6'>Agency</div>
//             <ul className="space-y-2 px-6">
//                 {agencies.map(agency => (
//                     <li 
//                         key={agency.id} 
//                         className="p-2 cursor-pointer hover:bg-gray-200 rounded flex justify-between items-center"
//                         onClick={() => handleAgencyClick(agency.id)}
//                     >
//                         <div className="flex items-center">
//                             <span className="font-medium truncate">{toTitleCase(agency.name)}</span>
//                             <span className="ml-2 text-sm text-gray-600 truncate">{agency.acronym}</span>
//                         </div>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default AgencySidebar;



// for aqim , need some acronym from backend or i can do frontend ? haha