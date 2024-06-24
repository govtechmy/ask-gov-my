"use client";

import { useRouter } from "@/lib/i18n";

interface Question {
  id: string;
  name: string;
  description_html: string;
  agency: string;
  createdAt: string;
  agencyId: string;
}

interface QuestionCardProps {
  question: Question;
}

const AGENCY_NAME_TO_ID = {
  MINISTRY_OF_FINANCE: "a30895aa-0f27-46b1-b782-9a4ff919cf2d",
  MINISTRY_OF_EDUCATION: "ef40d294-8737-4f3a-a97b-c1ed4ce2f174",
  MINISTRY_OF_TRANSPORTATION: "d13c5167-f77d-43d6-8efc-35f2985316a3",
  MINISTRY_OF_HEALTH: "ac051d6a-39b6-4df2-b6a6-12d64b48c780",
  MINISTRY_OF_ECONOMY: "108f76f0-7b0a-4b4f-828e-7c840156a3f9",
  MINISTRY_OF_TOURISM_ARTS_AND_CULTURE: "214d9194-ff01-46fc-9436-97586581f057",
  MINISTRY_OF_WOMEN_FAMILY_AND_COMMUNITY_DEVELOPMENT:
    "2dc0554f-7951-46ee-9fe4-57541f133038",
  MINISTRY_OF_NATURAL_RESOURCES_AND_ENVIRONMENTAL_SUSTAINABILITY:
    "9ac53fde-ce7c-4d86-ab69-7f53a9a91b56",
  MINISTRY_OF_YOUTH_AND_SPORTS: "f68f639d-56df-4e7a-a0af-8062b66198b8",
  MINISTRY_OF_HIGHER_EDUCATION: "4576929f-1438-4ae9-970b-30f087b8365e",
  MINISTRY_OF_PLANTATION_AND_COMMODITIES:
    "64236d33-b92b-4383-ac97-a4451a981cbe",
  MINISTRY_OF_HOUSING_AND_LOCAL_GOVERNMENT:
    "371218a4-f4f2-4e8e-88ac-128ccc03e4c1",
  MINISTRY_OF_HUMAN_RESOURCES: "183a3cab-0d49-468f-8915-aadbe2ecab20",
  MINISTRY_OF_INVESTMENT_TRADE_AND_INDUSTRY:
    "74137394-b689-4fd7-88a9-e3b2f7558758",
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const router = useRouter();

  const truncateDescription = (description: string, maxWords: number) => {
    const words = description.replace(/<\/?[^>]+(>|$)/g, "").split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
    return description;
  };

  const formatAgencyName = (name: string) => {
    const words = name.split("_");
    const acronym = words.map((word) => word.charAt(0).toUpperCase()).join("");

    const formattedName = words
      .map((word) => {
        if (word.toLowerCase() === "of") {
          return "OF";
        }
        return word.charAt(0).toUpperCase() + word.substr(1).toUpperCase();
      })
      .join("_");

    return { formattedName, acronym };
  };

  const { formattedName } = formatAgencyName(question.agency);
  const formattedNameParts = formattedName.toLowerCase().split("_");
  const formattedName2 = formattedNameParts
    .map((part, index) => {
      if (index === 0 || part !== "of") {
        return part.charAt(0).toUpperCase() + part.slice(1);
      } else {
        return part;
      }
    })
    .join(" ");

  const handleClick = () => {
    const agencyId =
      AGENCY_NAME_TO_ID[question.agency as keyof typeof AGENCY_NAME_TO_ID]; // Type assertion
    if (agencyId) {
      router.push(`/${formattedName}/${question.id}`);
    } else {
      console.error(`Agency ID not found for agency: ${question.agency}`);
    }
  };

  return (
    <div
      className="cursor-pointer items-center rounded-md border p-4 shadow-sm"
      onClick={handleClick}
    >
      <h2 className="text-lg font-semibold">{question.name}</h2>
      <div
        className="mt-2 text-sm"
        dangerouslySetInnerHTML={{
          __html: truncateDescription(question.description_html, 30),
        }}
      />
      <div className="mt-4 flex items-center">
        <span className="text-gray-600">{formattedName2}</span>
        <span className="ml-auto text-xs text-gray-400">
          {new Date(question.createdAt).toLocaleDateString("en-GB")}
        </span>
      </div>
    </div>
  );
};

export default QuestionCard;
