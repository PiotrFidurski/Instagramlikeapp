import { ArrowLeft } from "@assets/svgs/index";
import { css } from "@emotion/react";
import { elipsisText, mQ, navItem, navItemEnd, navItemStart } from "@styled";

export interface HeaderProps {
  onArrowClick: () => void;
  visibleOnLarge?: boolean;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ ...props }) => {
  const { children, onArrowClick, title, visibleOnLarge = false } = props;

  return (
    <div
      css={{
        display: visibleOnLarge ? "flex" : "none",
        alignItems: "center",
        height: "50px",
        position: "sticky",
        top: "0",
        zIndex: 1,
        borderBottom: "1px solid var(--border-color)",
        background: "var(--container-background)",
        [mQ("mobile")]: {
          display: "flex",
        },
      }}
    >
      <div
        onClick={onArrowClick}
        css={[
          navItem,
          navItemEnd,
          css`
            cursor: pointer;
            flex-grow: 0;
            justify-content: center;
            flex-basis: 50px;
          `,
        ]}
      >
        <ArrowLeft
          width="15px"
          height="15px"
          fill="var(--primary-text-color)"
        />
      </div>
      <div
        css={[
          navItem,
          navItemStart,
          css`
            margin-right: 0 !important;
            justify-content: center;
          `,
        ]}
      >
        <div
          css={{
            minWidth: "0px",
            maxWidth: "170px",
            display: "flex",
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <span
            css={css`
              letter-spacing: 2.5px;
              font-weight: 600;
              color: var(--primary-text-color);
              ${elipsisText}
            `}
          >
            {title}
          </span>
        </div>
      </div>
      <div
        css={[
          navItem,
          navItemEnd,
          css`
            flex-grow: 0;
            flex-basis: 50px;
            justify-content: center;
          `,
        ]}
      >
        {children}
      </div>
    </div>
  );
};
