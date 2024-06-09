"use client"
import { useEffect, useState } from "react";
import { getAgencies } from "@/API Services/AgencyServices";
import { Agency } from "@prisma/client";

const AgencyListNavbar = () => {
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
            <h1>Agencies List</h1>
            <div className="p-5 bg-#0000ff text-left border border-black rounded-md">
                {agencies.map((agency) => (
                    <div key={agency.id} className="agency-item">
                        <div>
                            <h2 className="p-5 bg-#0000ff text-left border border-black rounded-md">{agency.name}</h2>
                        </div>
                    </div>
                ))}
            </div>
            <div>&nbsp;</div>
            <h1 className="underline" style={{ cursor: 'pointer' }}>
            {/* add onClick after finish all */}
            See All Agencies
            </h1>
        </div>
    );
};

export default AgencyListNavbar;
