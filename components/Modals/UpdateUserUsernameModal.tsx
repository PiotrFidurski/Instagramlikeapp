import { api } from "@api/index";
import { CheckMark } from "@assets/svgs/index";
import { LoadingBar } from "@components/LoadingBar";
import { TextInput } from "@components/Login/TextInput";
import { css } from "@emotion/react";
import { Button, elipsisText, mQ } from "@styled";
import { Formik, FormikErrors, FormikHelpers } from "formik";
import { useSession } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { useMutation, useQueryClient } from "react-query";
import { setFormData } from "utils/fns";
import { ModalBase } from "./ModalComposition";
import { useModal } from "./ModalComposition/context";

interface Values {
  username: string;
}

export const UpdateUserUsernameModal: React.FC = () => {
  const [session] = useSession();

  const queryClient = useQueryClient();

  const router = useRouter();

  const { mutate, isLoading, status } = useMutation(
    "update_user",
    (formData: FormData) => api.users.update(formData)
  );

  const { user } = session!;

  const { setModal } = useModal();

  const handleSubmit = async ({ ...props }: FormikHelpers<Values> & Values) => {
    const values = {
      username: props.username,
      userId: user?._id!,
      bio: user?.bio! ? user?.bio : "",
      name: user?.name!,
    };

    const formData = setFormData({ ...values });

    mutate(formData, {
      onError: (error) => props.setErrors(error as FormikErrors<Values>),
      onSuccess: (data) => {
        queryClient.setQueryData("me", data);
        setModal((modal) => ({ ...modal, open: false, key: "" }));
      },
    });
  };

  React.useEffect(() => {
    if (router.pathname !== "/") {
      const formData = setFormData({
        userId: user?._id!,
        username: user?.username!,
        bio: user?.bio! ? user?.bio : "",
        name: user?.name!,
      });

      mutate(formData);

      setModal((modal) => ({ ...modal, open: false, key: "" }));
    }
  }, [router.pathname]);

  return (
    <>
      <ModalBase
        onCloseCallback={async () => {
          const formData = setFormData({
            userId: user?._id!,
            username: user?.username!,
            bio: user?.bio! ? user?.bio : "",
            name: user?.name!,
          });

          mutate(formData);
        }}
      >
        <Formik<Values>
          onSubmit={(values, props) => handleSubmit({ ...values, ...props })}
          initialValues={{ username: user.username }}
        >
          {({ ...props }) => (
            <form
              onSubmit={props.handleSubmit}
              css={{
                display: "flex",
                height: "280px",
                flexDirection: "column",
                [mQ("mobile")]: { height: "100vh" },
              }}
            >
              <ModalBase.Header
                title="Username"
                visibleOnLarge
                onArrowClick={() => {
                  const formData = setFormData({
                    userId: user?._id!,
                    username: user?.username!,
                    bio: user?.bio! ? user?.bio : "",
                    name: user?.name!,
                  });

                  mutate(formData);

                  setModal((modal) => ({ ...modal, open: false }));
                }}
              >
                <Button
                  active={true}
                  type="submit"
                  bgColor="rgb(29, 161, 242)"
                  css={{ padding: "8px 8px", flexGrow: 0 }}
                >
                  <CheckMark
                    width="15px"
                    height="15px"
                    fill="var(--primary-text-color)"
                  />
                </Button>
              </ModalBase.Header>
              <ModalBase.Content>
                <div
                  css={{
                    display: "flex",
                    padding: "10px 20px",
                    justifyContent: "center",
                    maxWidth: "400px",
                    marginTop: "25px",
                    width: "100%",
                    alignSelf: "center",
                  }}
                >
                  <div
                    css={{
                      display: "flex",
                      flexGrow: 1,
                      flexDirection: "column",
                    }}
                  >
                    <TextInput type="username" {...props} />
                    <div
                      css={{
                        display: "flex",
                        flexGrow: 1,
                        justifyContent: "flex-start",
                        paddingBottom: "30px",
                        minWidth: "0px",
                      }}
                    >
                      <div css={{ flexDirection: "column", display: "flex" }}>
                        <div
                          css={{
                            display: "flex",
                            minWidth: "0px",
                            flexGrow: 1,
                            maxWidth: "250px",
                          }}
                        >
                          <span
                            css={css`
                              ${elipsisText};
                              font-size: 14px;
                              color: var(--secondary-text-color);
                            `}
                          >
                            www.picturefeed.com/{props.values.username}
                          </span>
                        </div>

                        <span
                          css={css`
                            margin-top: 10px;
                            word-break: break-word;
                            font-size: 14px;
                            color: var(--tertiary-text-color);
                          `}
                        >
                          Usernames can contain letters, numbers and
                          underscores, changing your username will also change
                          your profile link, your username can be changed later
                          in your profile settings{" "}
                          <Link href={`/${props.values.username}/settings`}>
                            <a
                              css={{
                                color: "rgb(29, 161, 242)",
                                "&:hover": {
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                  textDecorationColor: "rgb(29, 161, 242)",
                                },
                              }}
                            >
                              here
                            </a>
                          </Link>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBase.Content>
            </form>
          )}
        </Formik>
      </ModalBase>
      {isLoading ? <LoadingBar isLoading={isLoading} status={status} /> : null}
    </>
  );
};
