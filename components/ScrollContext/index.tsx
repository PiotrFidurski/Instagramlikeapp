import { useRouter } from "next/router";
import * as React from "react";

const Context = React.createContext<{
  scrollTo: number;
  commentId: string;
  setScroll: React.Dispatch<
    React.SetStateAction<{
      scrollTo: number;
      commentId: string;
    }>
  >;
} | null>(null);

export const ScrollProvider: React.FC = ({ children }) => {
  const [scroll, setScroll] = React.useState({ scrollTo: 0, commentId: "" });
  const router = useRouter();

  const controlOnRoutes = [
    "/posts/[postId]",
    "/posts/[postId]/thread/[threadId]",
  ];

  React.useEffect(() => {
    if (!controlOnRoutes.includes(router.pathname)) {
      setScroll((scroll) => ({ ...scroll, commentId: "" }));
    }
  }, [router]);

  return (
    <Context.Provider value={{ ...scroll, setScroll }}>
      {children}
    </Context.Provider>
  );
};

export function useScroll() {
  const context = React.useContext(Context!);
  if (!context)
    throw new Error("please wrap your component in Context Provider.");
  return context;
}
