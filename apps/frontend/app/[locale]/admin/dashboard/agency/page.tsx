import React from "react";
import { FSP, inject } from "@/lib/decorator";
import MustBeAuthenticated from "@/middlewares/injectors/must-be-authenticated";
import MustBeAuthorized from "@/middlewares/injectors/must-be-authorized";

const ManageAgencies: FSP = async ({ searchParams }) => {
  return (
    <div className="container max-w-screen-lg pt-3 mx-auto">
      <div>TEMP AGENCY ADMIN PAGE</div>
    </div>
  );
};

export default inject(ManageAgencies, {
  // debug: true,
  middleware: [MustBeAuthenticated, MustBeAuthorized(["super_admin"])],
});
