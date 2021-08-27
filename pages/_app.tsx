import { AlertProvider } from "@components/Alerts/AlertComposition/context";
import { ModalProvider } from "@components/Modals/ModalComposition/context";
import { NavBar } from "@components/NavBar";
import { ScrollProvider } from "@components/ScrollContext";
import styled from "@emotion/styled";
import { mQ } from "@styled";
import { Provider } from "next-auth/client";
import { AppProps } from "next/app";
import * as React from "react";
import Modal from "react-modal";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { useTheme } from "utils/hooks/useTheme";
import "../styles/globals.css";

Modal.setAppElement("#__next");

const MainContainer = styled.main`
  max-width: 1100px;
  display: flex;
  margin: 60px auto;
  height: auto;
  align-items: flex-start;
  padding: 10px 10px;
  justify-content: space-between;
  ${mQ("900")} {
    max-width: 900px;
  }
  ${mQ("mobile")} {
    margin: 50px 0;
    padding: 0;
  }
  ${mQ("mobileLarge")} {
    justify-content: space-between;
    flex-grow: 1;
    flex-wrap: wrap;
  }
`;

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  const [,] = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ScrollProvider>
          <AlertProvider>
            <Provider session={pageProps.session}>
              <ModalProvider>
                <NavBar />
                <MainContainer>
                  <Component {...pageProps} />
                </MainContainer>
              </ModalProvider>
            </Provider>
          </AlertProvider>
        </ScrollProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
