type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string
        ? T[K] extends object
          ? `${K}.${DeepKeys<T[K]>}`
          : K
        : never;
    }[keyof T]
  : "";

export const extract = <T>(obj: T, deepKey: DeepKeys<T>): string => {
  const keys = deepKey.split(".");

  // Recursively traverse the object to find the value
  function traverse(object: any, keys: string[]): any {
    if (!object || keys.length === 0) {
      return object;
    }
    const [currentKey, ...remainingKeys] = keys;
    return traverse(object[currentKey], remainingKeys);
  }

  return traverse(obj, keys);
};
