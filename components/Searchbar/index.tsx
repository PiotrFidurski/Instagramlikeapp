import { api } from "@api/index";
import { Loupe } from "@assets/svgs/index";
import styled from "@emotion/styled";
import { UserType } from "@models/User";
import { mQ } from "@styled";
import * as React from "react";
import { InfiniteData } from "react-query";
import { useInfiniteLoader } from "utils/hooks/useInfiniteLoader";
import { PaginatedResult } from "utils/types";

const InputContainer = styled.div(({ active }: { active: boolean }) => ({
  border: active
    ? "1px solid var(--secondary-text-color)"
    : "1px solid var(--border-color)",
  borderRadius: "9999px",
  margin: "0 auto",
  width: "100%",
  position: "relative",
  display: "flex",
  alignItems: "center",
  height: "30px",
  [mQ("mobile")]: { width: "95%" },
}));

const Input = styled.input`
  width: 90%;
  outline: none;
  height: 100%;
  color: var(--primary-text-color);
  box-sizing: border-box;
  border-radius: inherit;
  border: 0;
  background: var(--container-color);
  :placeholder {
    color: var(--tertiary-text-color);
  }
`;

interface Props {
  children: ({
    ...props
  }: {
    data: InfiniteData<PaginatedResult<UserType>> | undefined;
    isLoading: boolean;
    active: boolean;
    isFetching: boolean;
    setActive: React.Dispatch<React.SetStateAction<boolean>>;
    setElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  }) => React.ReactElement;
}

const debounce = (fn: (...args: any) => void, delay: number) => {
  let timeoutId: any = undefined;

  return (...args: any) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export const SearchBar: React.FC<Props> = ({ children }) => {
  const [query, setQuery] = React.useState("");

  const [active, setActive] = React.useState(false);

  const [{ data, isLoading, isFetching }, setElement] = useInfiniteLoader<
    UserType
  >(
    ["search", query],
    api.users.search,
    { limit: 20, query },
    { enabled: Boolean(query) }
  );

  const handleKeyUp = debounce((e: React.BaseSyntheticEvent) => {
    setQuery(e.target.value);
  }, 350);

  return (
    <div css={{ width: "100%" }}>
      <InputContainer active={active} tabIndex={0}>
        <div
          css={{
            alignItems: "center",
            display: "flex",
            height: "100%",
            padding: "0 10px",
          }}
        >
          <Loupe
            width="15px"
            height="100%"
            fill={
              active
                ? "var(--secondary-text-color)"
                : "var(--tertiary-text-color)"
            }
          />
        </div>
        <Input
          css={{ zIndex: 2 }}
          onFocus={() => setActive(true)}
          onKeyUp={handleKeyUp}
          tabIndex={0}
          placeholder="Search"
          type="input"
        />
      </InputContainer>
      {children({ data, isLoading, active, setActive, setElement, isFetching })}
    </div>
  );
};
