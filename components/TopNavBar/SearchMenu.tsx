// @ts-nocheck
import { DropdownMenu } from "@components/DropdownMenu";
import { Results } from "@components/Searchbar/results";
import { User } from "@components/UserComposition";
import { Menu } from "@headlessui/react";
import { UserType } from "@models/User";
import * as React from "react";
import { InfiniteData } from "react-query";
import { PaginatedResult } from "utils/types";

interface Props {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  isFetching: boolean;
  data: InfiniteData<PaginatedResult<UserType>> | undefined;
  setElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export const SearchMenu: React.FC<Props> = ({ ...props }) => {
  const { active, setActive, isLoading, data, setElement } = props;

  return (
    <DropdownMenu isControlled={active} closeMenu={() => setActive(false)}>
      <Results {...props} smaller={true}>
        {!isLoading
          ? data?.pages?.map((page) =>
              page.pages.map((user) => (
                <div
                  key={user._id}
                  onClick={() => {
                    setActive?.(false);
                  }}
                  ref={setElement}
                  css={{ display: "flex", overflow: "hidden" }}
                >
                  <Menu.Item>
                    {() => (
                      <button
                        css={{
                          background: "transparent",
                          border: 0,
                          outline: "none",
                          flexGrow: 1,
                          zIndex: 2,
                        }}
                      >
                        <User
                          loading={isLoading}
                          borderBottom={false}
                          user={user}
                          key={user._id}
                          smaller={true}
                        >
                          <User.Avatar />
                          <User.Details />
                        </User>
                      </button>
                    )}
                  </Menu.Item>
                </div>
              ))
            )
          : null}
      </Results>
    </DropdownMenu>
  );
};
