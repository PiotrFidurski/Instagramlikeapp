import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, UseInfiniteQueryOptions } from "react-query";
import { PaginatedResult } from "utils/types";

export const useInfiniteLoader = <T>(
  queryKey: string | string[],
  callback: ({
    after,
    limit,
    query,
  }: {
    after?: string;
    limit?: number;
    query?: string;
  }) => Promise<any>,
  variables: Record<string, any>,
  config: UseInfiniteQueryOptions<PaginatedResult<T>> = {}
) => {
  const { ...props } = useInfiniteQuery<PaginatedResult<T>>(
    queryKey,
    ({ pageParam }) => callback({ after: pageParam, ...variables }),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.pageInfo && lastPage.pageInfo.hasNextPage
          ? lastPage.pageInfo.endCursor
          : undefined;
      },
      refetchOnWindowFocus: false,
      ...config,
    }
  );

  const observer = useRef<null | IntersectionObserver>(null);

  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          props.fetchNextPage();
        }
      },
      { threshold: 0 }
    );
  }, []);

  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver?.observe(currentElement!);
    }

    return () => {
      if (currentElement) {
        currentObserver?.unobserve(currentElement!);
      }
    };
  }, [element]);

  return [{ ...props }, setElement] as const;
};
