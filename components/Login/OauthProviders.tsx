import { Button, elipsisText, Spinner } from "@styled";
import { ClientSafeProvider, signIn } from "next-auth/client";
import * as React from "react";
import { data, Providers } from "./providerData";

interface Props {
  providers: Providers;
}

export const OauthProviders: React.FC<Props> = ({ providers }) => {
  return (
    <div css={{ flexGrow: 1 }}>
      {providers
        ? Object.values(providers!).map((provider) => {
            if (provider.name === "Credentials") return null;
            return <Provider provider={provider} key={provider.id} />;
          })
        : null}
    </div>
  );
};

interface ProviderProps {
  provider: ClientSafeProvider;
}

const Provider: React.FC<ProviderProps> = ({ provider }) => {
  const [loading, setLoading] = React.useState(false);
  return (
    <div
      css={{ flexGrow: 1, display: "flex", marginBottom: "7px" }}
      key={provider.name}
    >
      <Button
        bgColor={data[provider.name]?.().color}
        active={true}
        type="button"
        onClick={async () => {
          setLoading(true);
          signIn(provider.id, { callbackUrl: "/" });
        }}
      >
        {!loading ? data[provider.name]?.().render : <Spinner />}
        <span css={elipsisText}>Sign in with {provider.name}</span>
      </Button>
    </div>
  );
};
