import JataNegaraIcon from '@/icons/jatanegaraicon';
import React from 'react';

interface AgencyLogoImporterProps {
  currentAgency: {
    logo_url?: string | null;
    [key: string]: any;
  };
}

const LogoImporter: React.FC<AgencyLogoImporterProps> = ({ currentAgency }) => {
  return (
    <div className="h-[42px] w-[42px]">
      {(() => {
        if (currentAgency.logo_url !== null && currentAgency.logo_url !== '') {
          return (
            <div>
              <img src={currentAgency.logo_url} alt="Agency Logo" />
            </div>
          );
        } else {
          return (
            <div className="">
              <JataNegaraIcon />
            </div>
          );
        }
      })()}
    </div>
  );
};

export default LogoImporter;
