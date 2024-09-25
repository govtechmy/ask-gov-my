"use client";
import { useParams } from "next/navigation";
import { Agency } from "@/types/types";
import { defaultLocale } from "@/lib/i18n";

interface AgencyNameProps {
  agency: Agency;
}

const AgencyName: React.FC<AgencyNameProps> = ({ agency }) => {
  const params = useParams();
  const locale = params.locale;

  const displayName = locale === defaultLocale ? agency?.name_ms : agency?.name;

  return (
    <p>
      {displayName} ({agency?.acronym})
    </p>
  );
};

export default AgencyName;
