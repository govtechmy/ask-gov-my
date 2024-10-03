import { getTrendingAgencies } from "@/actions/questionServices";
import AgencyLogoImporter from "@/components/common/AgencyLogoImporter";
import WordTranslate from "@/components/common/WordTranslate";
import { FSP, inject } from "@/lib/decorator";
import { Link } from "@/lib/i18n";
import { Agency } from "@/types/types";

interface AgenciesBarProps {
  agencies: Agency[];
}

const TrendingAgenciesSidebar: FSP<AgenciesBarProps> = ({ data, locale }) => {
  const { agencies } = data!;
  return (
    <div className="w-full lg:w-[300px] flex flex-col gap-6">
      <WordTranslate
        translate="Mainpage"
        keyword="trendingA"
        className="font-semibold text-base text-black-700"
      />
      <ul className="flex flex-col gap-4.5">
        {agencies.map((agency: Agency) => (
          <Link
            key={agency.id}
            href={`/${agency.acronym.toLowerCase()}/topics/all`}
          >
            <li className="flex items-center gap-2.5">
              <div className="h-8 w-8 flex relative flex-shrink-0">
                <AgencyLogoImporter currentAgency={agency} />
              </div>
              <p className="text-base font-normal text-black-800 hover:text-askmygovtextbrand-600 hover:cursor-pointer">
                {locale === "ms-MY" ? agency.name_ms : agency.name}
              </p>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default inject(TrendingAgenciesSidebar, {
  // debug: true,
  async data(props) {
    const trendingAgencies = await getTrendingAgencies();
    const top10Agencies = trendingAgencies.slice(0, 10);
    return { agencies: top10Agencies };
  },
});
