import * as React from "react";

export interface ContentProps {}

export const Content: React.FC<ContentProps> = ({ children }) => {
  return <>{children}</>;
};
