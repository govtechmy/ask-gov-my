"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchQuestions } from '@/API Services/searchServices';
import { useDebounce } from '@/hooks/useDebounce';

interface Question {
    id: string;
    name: string;
    description_html: string;
    agency: string;
    createdAt: string;
    agencyId: string;
}

const AGENCY_NAME_TO_ID = {
    "MINISTRY_OF_FINANCE": "a30895aa-0f27-46b1-b782-9a4ff919cf2d",
    "MINISTRY_OF_EDUCATION": "ef40d294-8737-4f3a-a97b-c1ed4ce2f174",
    "MINISTRY_OF_TRANSPORTATION": "d13c5167-f77d-43d6-8efc-35f2985316a3",
    "MINISTRY_OF_HEALTH": "ac051d6a-39b6-4df2-b6a6-12d64b48c780",
    "MINISTRY_OF_ECONOMY": "108f76f0-7b0a-4b4f-828e-7c840156a3f9",
    "MINISTRY_OF_TOURISM_ARTS_AND_CULTURE": "214d9194-ff01-46fc-9436-97586581f057",
    "MINISTRY_OF_WOMEN_FAMILY_AND_COMMUNITY_DEVELOPMENT": "2dc0554f-7951-46ee-9fe4-57541f133038",
    "MINISTRY_OF_NATURAL_RESOURCES_AND_ENVIRONMENTAL_SUSTAINABILITY": "9ac53fde-ce7c-4d86-ab69-7f53a9a91b56",
    "MINISTRY_OF_YOUTH_AND_SPORTS": "f68f639d-56df-4e7a-a0af-8062b66198b8",
    "MINISTRY_OF_HIGHER_EDUCATION": "4576929f-1438-4ae9-970b-30f087b8365e",
    "MINISTRY_OF_PLANTATION_AND_COMMODITIES": "64236d33-b92b-4383-ac97-a4451a981cbe",
    "MINISTRY_OF_HOUSING_AND_LOCAL_GOVERNMENT": "371218a4-f4f2-4e8e-88ac-128ccc03e4c1",
    "MINISTRY_OF_HUMAN_RESOURCES": "183a3cab-0d49-468f-8915-aadbe2ecab20",
    "MINISTRY_OF_INVESTMENT_TRADE_AND_INDUSTRY": "74137394-b689-4fd7-88a9-e3b2f7558758"
};

const formatAgencyName = (name: string) => {
    const words = name.split('_');
    const acronym = words.map(word => word.charAt(0).toUpperCase()).join('');
    const formattedName = words.map(word => {
        if (word.toLowerCase() === 'of') {
            return 'OF';
        }
        return word.charAt(0).toUpperCase() + word.substr(1).toUpperCase();
    }).join('_');
    return { formattedName, acronym };
};

const truncateDescriptionHtml = (html: string, maxWords: number) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    const words = text.split(" ").slice(0, maxWords).join(" ");
    return words + (text.split(" ").length > maxWords ? "..." : "");
};

const SearchNavbar: React.FC = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Question[]>([]);
    const debouncedQuery = useDebounce(query, 500);
    const router = useRouter();

    useEffect(() => {
        if (debouncedQuery.length > 0) {
            const fetchSuggestions = async () => {
                const results: Question[] = await searchQuestions(debouncedQuery);
                setSuggestions(results);
            };

            fetchSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [debouncedQuery]);
    
    const handleSuggestionClick = (suggestion: any) => {
        const { formattedName } = formatAgencyName(suggestion.agency);
        setQuery('');
        setSuggestions([]);
        router.push(`/${formattedName}/${suggestion.id}`);
    };

    return (
        <nav className="bg-[#6183af] py-2">
            <div className="flex flex-col items-center justify-between max-w-screen-xl mx-auto px-5 py-10">
                <h1 className="mt-10 text-black text-3xl font-semibold">One stop for all your government questions</h1>
            </div>
            <form className="container max-w-screen-md mx-auto my-8 relative" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input
                        type="search"
                        id="default-search"
                        className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search by keyword or agency name (e.g., BTO grant or MOH)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Search
                    </button>
                </div>
                {suggestions.length > 0 && (
                    <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                        {suggestions.map((suggestion: any, index: number) => (
                            <li key={index} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSuggestionClick(suggestion)}>
                                <div className="text-sm font-medium">{suggestion.name}</div>
                                <div className="text-xs text-gray-500" dangerouslySetInnerHTML={{ __html: truncateDescriptionHtml(suggestion.description_html, 20) }} />
                            </li>
                        ))}
                    </ul>
                )}
            </form>
        </nav>
    );
};

export default SearchNavbar;
