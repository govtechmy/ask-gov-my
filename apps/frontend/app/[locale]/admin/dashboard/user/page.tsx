import React from "react";
import { FSP, inject } from "@/lib/decorator";
import MustBeAuthenticated from "@/middlewares/injectors/must-be-authenticated";
import MustBeAuthorized from "@/middlewares/injectors/must-be-authorized";

const ManageUsers: FSP = async ({ searchParams, context }) => {
  return (
    <div className="container max-w-screen-lg pt-3 mx-auto px-6">
      <div>TEMP ADMIN USER PAGE</div>
    </div>
  );
};

export default inject(ManageUsers, {
  // debug: true,
  middleware: [MustBeAuthenticated, MustBeAuthorized(["super_admin"])],
});
