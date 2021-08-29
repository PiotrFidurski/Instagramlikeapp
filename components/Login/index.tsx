import { api } from "@api/index";
import { LoadingBar } from "@components/LoadingBar";
import { Button } from "@styled";
import { Formik, FormikErrors } from "formik";
import { signIn } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { useMutation, useQueryClient } from "react-query";
import { loginSchema, registerSchema } from "../../schemaValidators/user";
import { OauthProviders } from "./OauthProviders";
import { Providers } from "./providerData";
import { Separator, SeparatorContainer } from "./styles";
import { TextInput } from "./TextInput";

interface Props {
  isRegistering: boolean;
  providers?: Providers;
}

export interface LoginValues {
  email: string;
  password: string;
}

export interface Values extends LoginValues {
  name: string;
  username: string;
}

const Login: React.FC<Props> = ({ isRegistering, providers }) => {
  const queryClient = useQueryClient();

  const { push } = useRouter();

  const { mutate, status, isLoading } = useMutation((values: Values) =>
    isRegistering ? api.users.register(values) : api.users.login(values)
  );

  const handleLogin = async ({ email, password }: LoginValues) => {
    try {
      const response = await signIn("credentials", {
        email,
        password,
        callbackUrl: process.env.SITE_URL,
        redirect: false,
      });

      if (response?.url) push(response?.url);
    } catch (error) {
      throw new Error(error as string);
    }
  };

  return (
    <div
      css={{
        maxWidth: "350px",
        width: "100%",
        background: "var(--container-background)",
        padding: "10px",
        border: "1px solid var(--border-color)",
        borderRadius: "3px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignContent: "flex-start",
      }}
    >
      <div css={{ padding: "5px 0 20px 0" }}>
        <span
          css={{
            letterSpacing: "2.5px",
            fontSize: 20,
            fontWeight: 600,
            color: "var(--primary-text-color)",
          }}
        >
          PictureFeed
        </span>
      </div>
      <Formik<Values>
        validationSchema={isRegistering ? registerSchema : loginSchema}
        initialValues={{
          email: "",
          name: "",
          username: "",
          password: "",
        }}
        onSubmit={async (values, { setErrors, setSubmitting }) => {
          setSubmitting(true);

          mutate(values, {
            onError: (error) => {
              setErrors(error as FormikErrors<Values>);
              setSubmitting(false);
            },
            onSuccess: async (data) => {
              await handleLogin({
                email: values.email,
                password: values.password,
              });
              queryClient.setQueryData("me", data);
            },
          });
        }}
      >
        {({ ...props }) => {
          const {
            values: { email, username, name, password },
            handleSubmit,
          } = props;

          return (
            <form
              onSubmit={handleSubmit}
              css={{ display: "flex", flexDirection: "column", width: "80%" }}
            >
              <LoadingBar isLoading={isLoading} status={status} />
              <TextInput type="email" {...props} />
              {isRegistering ? (
                <>
                  <TextInput type="name" {...props} />
                  <TextInput type="username" {...props} />
                </>
              ) : null}
              <TextInput type="password" {...props} />
              <div css={{ display: "flex", flexGrow: 1, marginBottom: "5px" }}>
                <Button
                  disabled={
                    isRegistering
                      ? !username.length ||
                        !name.length ||
                        !email.length ||
                        !password.length
                      : !email.length || !password.length
                  }
                  active={true}
                  type="submit"
                >
                  <span>{isRegistering ? "Register" : "Log In"}</span>
                </Button>
              </div>
              <SeparatorContainer>
                <Separator />
                <div css={{ padding: "0 15px" }}>
                  <span
                    css={{
                      fontSize: 14,
                      color: "var(--primary-text-color)",
                      fontWeight: 600,
                    }}
                  >
                    OR
                  </span>
                </div>
                <Separator />
              </SeparatorContainer>
              <div css={{ display: "flex", flexGrow: 1, marginBottom: "5px" }}>
                <Link href={isRegistering ? "/login" : "/register"}>
                  <a css={{ display: "flex", flexGrow: 1 }}>
                    <Button active={true} bgColor="rgb(36,36,36)" type="button">
                      <span>{isRegistering ? "Log In" : "Register"}</span>
                    </Button>
                  </a>
                </Link>
              </div>
              {!isRegistering ? (
                <SeparatorContainer>
                  <Separator />
                  <div css={{ padding: "0 15px" }}>
                    <span
                      css={{
                        fontSize: 14,
                        color: "var(--primary-text-color)",
                        fontWeight: 600,
                      }}
                    >
                      Sign in with
                    </span>
                  </div>
                  <Separator />
                </SeparatorContainer>
              ) : null}
              <OauthProviders providers={providers!} />
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export { Login };
