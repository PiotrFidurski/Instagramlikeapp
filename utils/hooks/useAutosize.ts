import autosize from "autosize";
import * as React from "react";

export const useAutosize = () => {
  const ref = React.useRef<any>(null);

  React.useEffect(() => autosize(ref.current!), []);

  return ref;
};
