"use client"
import { useEffect, useState } from "react";
import { getAgencies } from "@/API Services/AgencyServices";
import { Agency } from "@prisma/client";

const AgencyListComp = () => {
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
                        <h2 className="p-5 bg-#0000ff text-left border border-black rounded-md">{agency.name}</h2>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AgencyListComp;
