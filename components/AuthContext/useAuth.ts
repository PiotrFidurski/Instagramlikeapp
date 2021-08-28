import * as React from "react";
import { AuthContext } from "./Provider";

const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (!context)
    throw new Error("You are using AuthContext outside of AuthProvider.");

  return context;
};

export { useAuth };
