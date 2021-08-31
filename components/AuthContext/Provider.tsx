import { api } from "@api/index";
import { UserType } from "@models/User";
import { Session } from "next-auth";
import { useSession } from "next-auth/client";
import * as React from "react";
import { useQuery } from "react-query";

interface ContextProps {
  user: UserType;
  loading: boolean;
  sessionLoading: boolean;
  session: Session | null;
}

const AuthContext = React.createContext<ContextProps | null>(null);

const AuthProvider: React.FC = ({ children }) => {
  const [session, loading] = useSession();

  const { data, isLoading } = useQuery("me", () => api.users.me(), {
    enabled: !!session,
  });

  return (
    <AuthContext.Provider
      value={{
        user: data,
        sessionLoading: loading,
        loading: isLoading,
        session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
