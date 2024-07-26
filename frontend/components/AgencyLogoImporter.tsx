import JataNegaraIcon from '@/icons/jatanegaraicon';
import React from 'react';
import Image from 'next/image';

interface AgencyLogoImporterProps {
  currentAgency: {
    logo_url?: string | null;
    [key: string]: any;
  };
  logo_url?: string; // Optional fallback logo URL
}

const AgencyLogoImporter: React.FC<AgencyLogoImporterProps> = ({
  currentAgency,
  logo_url,
}) => {
  // Determine which logo URL to use
  const logoToUse = currentAgency.logo_url || logo_url;

  return (
    <>
      {logoToUse ? (
        <Image src={logoToUse} width={200} height={200} alt="Agency Logo" />
      ) : (
        // <Image
        //   src="/jata-200-transparent.png"
        //   width={200}
        //   height={200}
        //   alt="JataNegara"
        // />
        // above is sample for tranparent testing
        <Image src="/jata-200.png" width={200} height={200} alt="JataNegara" />
      )}
    </>
  );
};

export default AgencyLogoImporter;
