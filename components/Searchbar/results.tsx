import { UserLoader } from "@components/UserLoader";
import { UserType } from "@models/User";
import * as React from "react";
import { InfiniteData } from "react-query";
import { PaginatedResult } from "utils/types";
import { CenterItems } from "./styles";

interface Props {
  data: InfiniteData<PaginatedResult<UserType>> | undefined;
  isLoading: boolean;
  smaller?: boolean;
  isFetching: boolean;
}

export const Results: React.FC<Props> = ({ ...props }) => {
  const { isLoading, data, isFetching, smaller = false, children } = props;

  return (
    <div css={{ display: "flex", flexDirection: "column" }}>
      {!data && !isLoading ? (
        <div css={CenterItems}>
          <span>no recent searches.</span>
        </div>
      ) : null}
      {data && data?.pages[0].pages.length === 0 && !isLoading ? (
        <div css={CenterItems}>
          <span>no matching users found.</span>
        </div>
      ) : null}
      {children}
      {isFetching ? (
        <>
          <UserLoader isLoading={true} smaller={smaller} />
          <UserLoader isLoading={true} smaller={smaller} />
        </>
      ) : null}
    </div>
  );
};
