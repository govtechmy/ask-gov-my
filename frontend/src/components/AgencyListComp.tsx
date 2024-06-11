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
                setAgencies(fetchedAgencies);
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
        </div>
    );
};

export default AgencyListComp;