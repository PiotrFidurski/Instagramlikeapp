import { SearchBar } from "@components/Searchbar";
import { Results } from "@components/Searchbar/results";
import { User } from "@components/UserComposition";
import { mQ } from "@styled";

const SearchPage: React.FC = () => (
  <div
    css={{
      width: "100%",
      marginTop: "10px",
    }}
  >
    <SearchBar>
      {({ setElement, setActive, active, ...props }) => (
        <div
          css={{
            display: "flex",
            flexGrow: 1,
            marginTop: "10px",
            flexDirection: "column",
            borderLeft: "1px solid var(--border-color)",
            borderRight: "1px solid var(--border-color)",
            borderBottom: "1px solid var(--border-color)",
            borderTop: "1px solid var(--border-color)",
            minHeight: "808px",
            width: "100%",
            background: "var(--container-background)",
            [mQ("mobile")]: {
              borderLeft: 0,
              borderRight: 0,
              borderBottom: 0,
            },
          }}
        >
          <Results {...props}>
            {!props.isLoading
              ? props.data?.pages.map((page) =>
                  page.pages.map((user) => (
                    <button
                      ref={setElement}
                      onClick={() => {
                        setActive?.(false);
                      }}
                      css={{
                        background: "transparent",
                        border: 0,
                        outline: "none",
                        zIndex: 2,
                      }}
                    >
                      <User
                        loading={props.isLoading}
                        borderBottom={false}
                        user={user}
                        key={user._id}
                      >
                        <User.Avatar />
                        <User.Details />
                      </User>
                    </button>
                  ))
                )
              : null}
          </Results>
        </div>
      )}
    </SearchBar>
  </div>
);

export default SearchPage;
