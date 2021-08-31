import { api } from "@api/index";
import { UserType } from "@models/User";
import { useSession } from "next-auth/client";
import * as React from "react";
import { useQuery } from "react-query";

interface ContextProps {
  user: UserType;
  loading: boolean;
  error: boolean;
}

const AuthContext = React.createContext<ContextProps | null>(null);

const AuthProvider: React.FC = ({ children }) => {
  const [session] = useSession();

  const { data, isLoading, isError } = useQuery("me", () => api.users.me(), {
    enabled: !!session,
  });

  return (
    <AuthContext.Provider
      value={{ user: data, loading: isLoading, error: isError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
