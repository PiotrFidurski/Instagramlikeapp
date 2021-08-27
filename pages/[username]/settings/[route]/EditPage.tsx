import { api } from "@api/index";
import { Plus } from "@assets/svgs/index";
import { useAlert } from "@components/Alerts/AlertComposition/context";
import { LoadingBar } from "@components/LoadingBar";
import { TextInput } from "@components/Login/TextInput";
import { css } from "@emotion/react";
import { PostType } from "@models/Post";
import { UserType } from "@models/User";
import { AvatarWrapper, Button, elipsisText, mQ } from "@styled";
import { Formik, FormikErrors, FormikHelpers } from "formik";
import Image from "next/image";
import { useRouter } from "next/router";
import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { setFormData } from "utils/fns";
import { useImagePreview } from "utils/hooks/useImagePreview";
import { PaginatedResult } from "utils/types";
import {
  Container,
  formStyle,
  speparatorStyle,
} from "../../../../utils/UserSettingsPage/styles";

interface Values {
  username: string;
  name: string;
  bio: string;
  file: File | null;
}

interface Props {
  user: UserType;
}

const EditPage: React.FC<Props> = ({}) => {
  const queryClient = useQueryClient();

  const router = useRouter();

  const { data: user, isLoading } = useQuery<UserType>(
    ["user", router.query.username],
    () =>
      api.users.getUserByUsername({
        username: router.query.username as string,
      }),
    { enabled: !!router.query.username }
  );

  const { createAlert } = useAlert();

  const [preview, readFile, clearPreview] = useImagePreview();

  const { mutate, status, isLoading: mutationLoading, reset } = useMutation(
    ["update_user", user?.username!],
    (formData: FormData) => api.users.update(formData),
    {
      onSuccess: async (data: UserType) => {
        const userFeed = queryClient.getQueryData("userFeed");

        queryClient.setQueryData("me", data);

        if (userFeed) {
          queryClient.setQueryData(
            "userFeed",
            (
              old:
                | {
                    pageParams: Array<"string" | undefined>;
                    pages: PaginatedResult<PostType>[];
                  }
                | undefined
            ) => ({
              ...old!,
              ...old?.pages?.map((page) =>
                page.pages?.filter((p: PostType) => {
                  if (p.owner._id === data._id) {
                    p.owner = data;
                    return p;
                  }
                  return p;
                })
              ),
            })
          );
        } else {
          queryClient.invalidateQueries("userFeed");
        }
      },
    }
  );

  const handleSubmit = ({ ...props }: FormikHelpers<Values> & Values) => {
    const { username, name, bio, file, setErrors } = props;

    const values = { username, name, bio, file, userId: user?._id! };

    const formData = setFormData({ ...values });

    mutate(formData, {
      onSuccess: (data) => {
        queryClient.setQueryData(["user", user!.username], data);

        queryClient.refetchQueries("userFeed");

        createAlert("update", {
          timeout: 5000,
          value: "User",
        });

        setTimeout(() => {
          clearPreview();
          reset();
        }, 300);
      },
      onError: (error) => setErrors(error as FormikErrors<Values>),
    });
  };

  if (!user) return <></>;

  return (
    <Container>
      <LoadingBar isLoading={mutationLoading} status={status} />
      <span
        css={css`
          font-weight: 600;
          font-size: 15;
          color: var(--secondary-text-color);
          ${elipsisText};
        `}
      >
        Edit Profile
      </span>
      <div css={speparatorStyle} />
      <Formik<Values>
        initialValues={{
          username: user!.username,
          name: user!.name,
          bio: user!.bio || "",
          file: null,
        }}
        onSubmit={(values, props) => handleSubmit({ ...values, ...props })}
      >
        {({ ...props }) => (
          <form css={formStyle} onSubmit={props.handleSubmit}>
            <div
              css={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "row",
                [mQ("mobile")]: { flexDirection: "column-reverse" },
              }}
            >
              <div css={{ flexGrow: 1, width: "100%" }}>
                <TextInput type="username" {...props} />
                <span
                  css={{
                    fontSize: 12,
                    color: "var(--tertiary-text-color)",
                    marginBottom: "10px",
                    display: "flex",
                  }}
                >
                  Other users can @mention you by username.
                </span>
                <TextInput type="name" {...props} />
                <span
                  css={{
                    fontSize: 12,
                    color: "var(--tertiary-text-color)",
                    marginBottom: "10px",
                    display: "flex",
                  }}
                >
                  Help people discover your account by using the name you're
                  known by: either your full name, nickname, or business name.
                </span>
                <textarea
                  name="bio"
                  value={props.values.bio}
                  onChange={props.handleChange}
                  css={{
                    height: "80px",
                    width: "100%",
                    resize: "vertical",
                    padding: "10px",
                    borderRadius: "3px",
                    border: 0,
                  }}
                />
              </div>
              <div
                css={css`
                  background: transparent;
                  display: flex;
                  height: 90px;
                  flex-direction: column;
                  margin-left: 10px;
                  width: 90px;
                  justify-content: center;
                  align-items: center;
                  position: relative;
                  ${mQ("mobile")} {
                    margin-bottom: 10px;
                    flex-direction: row;
                    margin-left: 0;
                  }
                `}
              >
                <AvatarWrapper width="90px" height="90px">
                  <Image
                    src={preview ? preview : (user?.image as string)}
                    objectFit="cover"
                    layout="fill"
                  />
                  <input
                    name="file"
                    type="file"
                    css={{
                      position: "absolute",
                      cursor: "pointer",
                      zIndex: 1,
                      opacity: 0,
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      width: "100%",
                    }}
                    onClick={(e: React.BaseSyntheticEvent) => {
                      e.target.value = null;
                    }}
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      readFile(e);
                      props.setFieldValue("file", e.target?.files?.[0]);
                    }}
                  />
                </AvatarWrapper>
                <Plus
                  css={{
                    position: "absolute",
                    borderRadius: 9999,
                    boxShadow: "0px 0px 5px 1px white",
                  }}
                  width="25px"
                  stroke="white"
                  strokeWidth="10px"
                  height="25px"
                  fill="var(--primary-text-color)"
                />
                {preview ? (
                  <Button
                    active={true}
                    onClick={() => {
                      clearPreview();
                      props.setFieldValue("file", null);
                    }}
                    css={{
                      padding: "5px 7px",
                      fontSize: "12px",
                      position: "absolute",
                      bottom: 0,
                      left: "49px",
                      zIndex: 2,
                    }}
                  >
                    <span>Clear</span>
                  </Button>
                ) : null}
              </div>
            </div>
            <div css={{ maxWidth: "100px", marginTop: "10px" }}>
              <Button active={false} type="submit">
                <span css={elipsisText}>Submit</span>
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default EditPage;
