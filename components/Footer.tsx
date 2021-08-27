import { css } from "@emotion/react";

const textStyle = css`
  padding: 3px 0;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;
const separator = css`
  padding: 0 5px;
  font-weight: 700;
`;

export const Footer: React.FC = () => (
  <div
    css={{
      marginTop: "10px",
      display: "flex",
      flexWrap: "wrap",
      color: "var(--tertiary-text-color)",
      fontSize: "12px",
      alignItems: "center",
      padding: "0 7px",
    }}
  >
    <span css={textStyle}>Terms of Service</span>
    <span css={separator}>·</span>
    <span css={textStyle}>Privacy Policy</span>
    <span css={separator}>·</span>
    <span css={textStyle}>Cookie Policy</span>
    <span css={separator}>·</span>
    <span css={textStyle}>Cookie Policy</span>
    <span css={separator}>·</span>
    <span css={textStyle}>Ads info</span>
    <span css={separator}>·</span>
    <span css={textStyle}>© 2021 FeedPicture, Inc.</span>
  </div>
);
