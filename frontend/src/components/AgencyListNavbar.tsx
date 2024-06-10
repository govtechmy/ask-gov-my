// "use client"
// import { useEffect, useState } from "react";
// import { getAgencies } from "@/API Services/AgencyServices";
// import { Agency } from "@prisma/client";
// import Link from "next/link";

// const AgencyListNavbar = () => {
//     const [agencies, setAgencies] = useState<Agency[]>([]);

//     useEffect(() => {
//         async function fetchAgencies() {
//             try {
//                 const fetchedAgencies = await getAgencies();
//                 setAgencies(fetchedAgencies.slice(0, 5));
//             } catch (error) {
//                 console.error("Error fetching agencies:", error);
//             }
//         }
//         fetchAgencies();
//     }, []);

//     return (
//         <div className="p-5 bg-#0000ff text-left border border-black rounded-md">
//             <h1>Agencies List</h1>
//             <div className="p-5 bg-#0000ff text-left border border-black rounded-md">
//                 {agencies.map((agency) => (
//                     <div key={agency.id} className="agency-item">
//                         <div>
//                             <h2 className="p-5 bg-#0000ff text-left border border-black rounded-md">{agency.name}</h2>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             <div>&nbsp;</div>
//             <Link href="/AgencyListPage">
//                 <h1 className="underline" style={{ cursor: 'pointer' }}>
//                     See All Agencies
//                 </h1>
//             </Link>
//         </div>
//     );
// };

// export default AgencyListNavbar;

"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAgencies } from "@/API Services/AgencyServices";

interface Agency {
    id: number;
    name: string;
    slug: string;
    projectId: string;
    apiKey: string;
  }

interface AgencyListProps {
    onAgencySelect: (agencyName: string) => void;
}

const AgencyListComp: React.FC<AgencyListProps> = ({ onAgencySelect }) => {
    const [agencies, setAgencies] = useState<Agency[]>([]);

    useEffect(() => {
        async function fetchAgencies() {
            try {
                const fetchedAgencies = await getAgencies();
                setAgencies(fetchedAgencies.slice(0, 5));
            } catch (error) {
                console.error("Error fetching agencies:", error);
            }
        }
        fetchAgencies();
    }, []);

    return (
        <div className="p-5 bg-#0000ff text-left border border-black rounded-md">
            <h1>Agencies:</h1>
            {agencies.map((agency) => (
                <div key={agency.id} className="agency-item">
                    <div>
                        <Link href={{
                            pathname: '/QuestionAgencyPage',
                            query: { name: agency.name }
                        }}>
                            <div
                                className="p-5 bg-#0000ff text-left border border-black rounded-md"
                            >
                                {agency.name}
                            </div>
                        </Link>
                    </div>
                </div>
            ))}
             <div>&nbsp;</div>
             <Link href="/AgencyListPage">
                 <h1 className="underline" style={{ cursor: 'pointer' }}>
                     See All Agencies
                 </h1>
             </Link>
        </div>
    );
};

export default AgencyListComp;