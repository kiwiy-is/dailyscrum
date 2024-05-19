import { unstable_cache } from "next/cache";
import { cache } from "react";

function persist<T extends any[], R>(
  callback: (...args: T) => Promise<R>,
  functionName: string
) {
  return (...args: T) => {
    const key = `${functionName}(${args.join(", ")})`; // TODO: is this really a good way to do this?
    return unstable_cache(
      async (...args: any[]) => {
        return callback(...(args as T));
      },
      [key],
      {
        tags: [key],
      }
    )(...args);
  };
}

/**
 * Memoizes and persists a function.
 *
 * Context: The initial intention of the function is to memoize with React's `cache` and persist with NextJS `unstable_cache`.
 * As the following code gets plenty, the pattern is abstracted as a function.
 *
 * e.g.
 * ```
 * const listWorkspaces = cache((userId: string) =>
 *   unstable_cache(
 *    async (userId: string) => {
 *      const client = createClient<Database>();
 *
 *      return await client
 *        .from("workspaces")
 *        .select(
 *          `
 *          id: hash_id,
 *          name,
 *          members!inner(
 *            user_id
 *          )
 *        `
 *        )
 *        .eq("members.user_id", userId);
 *     },
 *     [],
 *     {
 *       tags: [`listWorkspaces(${userId})`],
 *     }
 *   )(userId)
 * );
 * ```
 * @param func - The function to be memoized and persisted.
 * @param functionName - The name of the function to used as a cache key.
 */
export function memoizeAndPersist<T extends any[], R>(
  callback: (...args: T) => Promise<R>,
  functionName: string
) {
  // TODO: check other ways to revalidate and apply
  const persistedCallback = persist(callback, functionName);

  return (...args: T) => {
    // return cache((...args: any[]) => persistedCallback(...(args as T)))(
    //   ...args
    // );

    return cache((...args: any[]) => callback(...(args as T)))(...args);
  };
}

export function memoize<T extends any[], R>(
  callback: (...args: T) => Promise<R>
) {
  return cache((...args: T) => callback(...args));
}
