/**
 * Debouncer
 * @param func Function to debounce
 * @param wait Delay
 * @param immediate Boolean
 * @returns
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number = 300,
  immediate: boolean = false
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: Parameters<T>) {
    let context = this;

    clearTimeout(timeout!);
    if (immediate && !timeout) func.apply(context, args);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
  };
};
