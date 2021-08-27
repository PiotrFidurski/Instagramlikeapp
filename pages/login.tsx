import { api } from "@api/index";
import { Login } from "@components/Login";
import { Providers } from "@components/Login/providerData";
import { Spinner } from "@styled";
import * as React from "react";
import { useQuery } from "react-query";

interface Props {
  providers: Providers;
}

const LoginPage: React.FC<Props> = ({}) => {
  const { data, isLoading } = useQuery<Providers>(
    "providers",
    () => api.users.providers(),
    { refetchOnMount: true, refetchOnWindowFocus: true }
  );

  if (isLoading)
    return (
      <div
        css={{
          maxWidth: "350px",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          height: "500px",
          alignItems: "center",
          justifyContent: "center",
          alignContent: "flex-start",
        }}
      >
        <Spinner />
      </div>
    );

  return <Login isRegistering={false} providers={data} />;
};

export default LoginPage;
