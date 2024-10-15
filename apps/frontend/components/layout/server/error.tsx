import { ServerProp } from "@/lib/decorator";
import { FunctionComponent } from "react";

const Error: FunctionComponent<ServerProp> = ({ error }) => {
  return <div>{JSON.stringify(error)}</div>;
};

export default Error;
