import { api } from "@api/index";
import { LoadingBar } from "@components/LoadingBar";
import { Preview, PreviewButtons } from "@components/UploadPreview";
import { AvatarWrapper, Button, mQ } from "@styled";
import { Formik, FormikErrors, FormikHelpers } from "formik";
import { useSession } from "next-auth/client";
import Image from "next/image";
import { useRouter } from "next/router";
import * as React from "react";
import { useMutation, useQueryClient } from "react-query";
import { useAutosize } from "utils/hooks/useAutosize";
import { useImagePreview } from "utils/hooks/useImagePreview";

interface Values {
  description: string;
  file: File | null | Blob | string;
}

export interface Upoload {
  degrees: number;
  preview: string;
}

const CreatePage: React.FC = () => {
  const { push } = useRouter();

  const queryClient = useQueryClient();

  const [preview, readFile, clearPreview] = useImagePreview();

  const [degrees, setDegrees] = React.useState(0);

  const textAreaRef = useAutosize();

  const [session, loading] = useSession();

  const { mutate, status, isLoading } = useMutation(
    (formData: FormData) => api.posts.create(formData),
    {
      onSuccess: async (data) => {
        queryClient.setQueryData("userFeed", data);
      },
    }
  );

  const handleSubmit = async ({ ...props }: FormikHelpers<Values> & Values) => {
    const { file, description, setErrors } = props;

    const formData = new FormData();

    formData.append("file", file!);

    formData.set("description", description);

    formData.set("angle", degrees.toString());

    mutate(formData, {
      onError: (error) => setErrors(error as FormikErrors<Values>),
      onSuccess: () => {
        setTimeout(() => {
          push("/");
        }, 500);
      },
    });
  };

  if (loading) return <></>;

  return (
    <Formik<Values>
      onSubmit={(values, props) => handleSubmit({ ...values, ...props })}
      initialValues={{ description: "", file: null }}
    >
      {({
        handleSubmit,
        handleChange,
        setFieldValue,
        values: { description },
        errors,
      }) => {
        return (
          <form
            onSubmit={handleSubmit}
            css={{
              color: "var(--primary-text-color)",
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <div
              css={{
                color: "var(--primary-text-color)",
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <div
                css={{
                  display: "flex",
                  flexGrow: 1,
                  border: "2px dashed var(--border-color)",
                  maxWidth: "100%",
                  position: "relative",
                  justifyContent: "center",
                  [mQ("mobile")]: {
                    border: 0,
                  },
                }}
              >
                <input
                  name="file"
                  type="file"
                  css={{
                    position: "absolute",
                    cursor: "pointer",
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
                    setFieldValue("file", e?.target?.files?.[0]);
                  }}
                />

                <div
                  css={{
                    background: "var(--container-background)",
                    height: "500px",
                    width: "100%",
                    position: "relative",
                    overflow: "hidden",
                    zIndex: preview ? 1 : -1,
                  }}
                >
                  <Preview preview={preview} degrees={degrees}>
                    <PreviewButtons
                      clearPreview={clearPreview}
                      clearInput={() => setFieldValue("file", null)}
                      rotate={() => setDegrees((degrees) => (degrees += 90))}
                    />
                  </Preview>
                </div>
              </div>
              <div
                css={{
                  display: "flex",
                  flexDirection: "column",
                  background: "var(--container-background)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "3px",
                  marginTop: "10px",
                  [mQ("mobile")]: {
                    border: 0,
                    marginTop: 0,
                    borderTop: "1px solid var(--border-color)",
                  },
                }}
              >
                <div
                  css={{
                    display: "flex",
                    flexGrow: 1,
                    justifyContent: "space-between",
                    padding: "10px",
                    height: "50px",
                    minHeight: "80px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    css={{
                      display: "flex",
                      alignItems: "flex-start",
                      marginRight: "10px  ",
                    }}
                  >
                    <AvatarWrapper width="38px" height="38px">
                      <Image
                        src={session?.user?.image!}
                        objectFit="contain"
                        alt="userAvatar"
                        width="150px"
                        height="150px"
                        layout="responsive"
                      />
                    </AvatarWrapper>
                  </div>
                  <div
                    css={{
                      display: "flex",
                      flexGrow: 1,
                      height: "100%",
                      flexDirection: "column",
                    }}
                  >
                    <textarea
                      ref={textAreaRef}
                      rows={1}
                      placeholder="Add a description"
                      autoComplete="false"
                      name="description"
                      onChange={handleChange}
                      css={{
                        lineHeight: "18px",
                        borderRadius: "6px",
                        border: "1px solid var(--border-color)",

                        padding: "4px 10px 4px 4px",
                        fontSize: 12,
                        maxHeight: "60px",
                        font: "inherit",
                        overflow: "auto",
                        color: "var(--primary-text-color)",
                        outline: "none",
                        flexGrow: 1,
                        background: "var(--container-background)",
                        "::placeholder": {
                          color: "var(--primary-text-color)",
                        },
                        // border: 0,
                        resize: "none",
                      }}
                    />
                    <span
                      css={{
                        fontSize: 12,
                        fontWeight: "bold",
                        color: "#ef5350",
                      }}
                    >
                      {errors.description}
                    </span>
                  </div>
                  <div
                    css={{
                      position: "relative",
                      width: "60px",
                      height: "60px",
                      overflow: "hidden",
                      marginLeft: "10px",
                      borderRadius: "3px",
                      background: "var(--background-color)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    {preview ? (
                      <Preview degrees={degrees} preview={preview} />
                    ) : null}
                  </div>
                </div>
                <div
                  css={{
                    display: "flex",
                    alignSelf: "flex-end",
                    padding: "10px",
                  }}
                >
                  <Button
                    type="submit"
                    active={false}
                    disabled={!description || !preview}
                  >
                    Create
                  </Button>
                </div>
              </div>
              <span
                css={{ fontSize: 12, fontWeight: "bold", color: "#ef5350" }}
              >
                {errors.file}
              </span>
            </div>
            <LoadingBar isLoading={isLoading} status={status} />
          </form>
        );
      }}
    </Formik>
  );
};

export default CreatePage;
