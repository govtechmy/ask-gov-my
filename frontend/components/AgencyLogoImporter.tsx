import { Agency, getAgencyList } from '@/actions/questionServices';

interface LogoImporterProps {
  id: number; // ID of the agency whose logo needs to be displayed
}

const LogoImporter: React.FC<LogoImporterProps> = ({ id }) => {
  let agencyFull: Agency[] = [];
  let agencyIDandLogo: { id: number; logo_url: string | undefined }[] = [];

  const fetchAgencyList = async () => {
    try {
      agencyFull = await getAgencyList();

      // Check if agencyFull is empty or not
      if (!agencyFull || agencyFull.length === 0) {
        throw new Error('Agency list is empty');
      }

      // Extracting id and logo_url from agencyFull
      agencyIDandLogo = agencyFull.map(agency => ({
        id: agency.id,
        logo_url: agency.logo_url,
      }));

      // Find the agency with the specified id
      const agency = agencyFull.find(agency => agency.id === id);

      // Display the logo or "X" icon based on logo_url
      return (
        <div className="pr-[10px]">
          {agency ? (
            agency.logo_url ? (
              <img src={agency.logo_url} alt={`Logo of ${agency.name}`} />
            ) : (
              <span>X</span> // Display "X" if logo_url is null or undefined
            )
          ) : (
            'Agency not found'
          )}
        </div>
      );
    } catch (error) {
      console.log('Error fetching agency list:', error);
    }
  };

  return fetchAgencyList();
};

export default LogoImporter;
