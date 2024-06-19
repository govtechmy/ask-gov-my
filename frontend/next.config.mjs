const AGENCY = {
  "MINISTRY_OF_FINANCE": "a30895aa-0f27-46b1-b782-9a4ff919cf2d",
  "EDUCATION_MINISTRY": "ef40d294-8737-4f3a-a97b-c1ed4ce2f174",
  "TRANSPORT_MINISTRY": "d13c5167-f77d-43d6-8efc-35f2985316a3",
  "MINISTRY_OF_HEALTH": "ac051d6a-39b6-4df2-b6a6-12d64b48c780",
  "TOURISM_MINISTRY": "a43e382b-6445-43d2-bf03-eeeb74feb0c8",
};

function findAgencyIdByName(name) {
  // Lookup agency ID based on name in the AGENCY object
  return AGENCY[name];
}

export default {
  async rewrites() {
    const rewriteRules = Object.keys(AGENCY).map((name) => ({
      source: `/${name}`, // Matches any URL with an agency name segment
      destination: `/${findAgencyIdByName(name)}`, // Function to lookup agency ID
    }));

    return rewriteRules;
  },
};
