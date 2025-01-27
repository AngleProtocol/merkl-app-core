
/**
 * Pick keys and more some optional
 * @param T object to strip keys from
 * @param Key keys to pick from object
 * @param Optional keys to make optional
 */
export type PickAndOptOut<T, Key extends keyof T, Optional extends Key = never> = Omit<Pick<T, Key>, Optional> & {
  [O in Optional]?: T[O];
};
