const AGENCY = {
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

//important update on agency

function findAgencyIdByName(name) {
  return AGENCY[name];
}

export default {
  async rewrites() {
    const rewriteRules = Object.keys(AGENCY).flatMap(name => [
      {
        source: `/${name}`,
        destination: `/${findAgencyIdByName(name)}`,
      },
      {
        source: `/${name}/:questionId`,
        destination: `/${findAgencyIdByName(name)}/:questionId`,
      } 
    ]);

    return rewriteRules;
  },
};
