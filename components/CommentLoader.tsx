import { Skeleton } from "@material-ui/lab";
import * as React from "react";

interface Props {}

export const CommentLoader: React.FC<Props> = () => {
  return (
    <div
      css={{
        display: "flex",
        marginTop: "15px",
        padding: "5px",
        height: "80px",
        color: "var(--primary-text-color)",
      }}
    >
      <div css={{ height: "25px" }}>
        <Skeleton variant="circle" width={25} />
      </div>
      <div
        css={{
          display: "flex",
          flexGrow: 1,
          justifyContent: "space-between",
        }}
      >
        <div
          css={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "10px",
          }}
        >
          <div css={{ display: "flex", height: "13px" }}>
            <Skeleton variant="text" width={100} />
          </div>

          <div
            css={{
              display: "flex",
              height: "auto",
              flexWrap: "wrap",
              justifyContent: "flex-start",
            }}
          >
            <div css={{ height: "13px" }}>
              <Skeleton
                variant="text"
                width={20}
                css={{ marginRight: "5px" }}
              />
            </div>

            <div css={{ height: "13px" }}>
              <Skeleton
                variant="text"
                width={100}
                css={{ marginRight: "5px" }}
              />
            </div>
            <div css={{ height: "13px" }}>
              <Skeleton
                variant="text"
                width={80}
                css={{ marginRight: "5px" }}
              />
            </div>
            <div css={{ height: "13px" }}>
              <Skeleton
                variant="text"
                width={30}
                css={{ marginRight: "5px" }}
              />
            </div>
            <div css={{ height: "13px" }}>
              <Skeleton
                variant="text"
                width={20}
                css={{ marginRight: "5px" }}
              />
            </div>

            <div css={{ height: "13px" }}>
              <Skeleton
                variant="text"
                width={100}
                css={{ marginRight: "5px" }}
              />
            </div>
            <div css={{ height: "13px" }}>
              <Skeleton
                variant="text"
                width={80}
                css={{ marginRight: "5px" }}
              />
            </div>
            <div css={{ height: "13px" }}>
              <Skeleton
                variant="text"
                width={30}
                css={{ marginRight: "5px" }}
              />
            </div>
            <div css={{ height: "13px" }}>
              <Skeleton
                variant="text"
                width={20}
                css={{ marginRight: "5px" }}
              />
            </div>

            <div css={{ height: "13px" }}>
              <Skeleton
                variant="text"
                width={100}
                css={{ marginRight: "5px" }}
              />
            </div>
            <div css={{ height: "13px" }}>
              <Skeleton
                variant="text"
                width={80}
                css={{ marginRight: "5px" }}
              />
            </div>
            <div css={{ height: "13px" }}>
              <Skeleton
                variant="text"
                width={30}
                css={{ marginRight: "5px" }}
              />
            </div>
          </div>

          <div
            css={{
              display: "flex",
              height: "13px",
              justifyContent: "space-between",
              maxWidth: "200px",
            }}
          >
            <Skeleton variant="text" width={50} />
            <Skeleton variant="text" width={50} />
            <Skeleton variant="text" width={50} />
          </div>
        </div>
        <div css={{ height: "20px" }}>
          <Skeleton variant="text" width={20} />
        </div>
      </div>
    </div>
  );
};
