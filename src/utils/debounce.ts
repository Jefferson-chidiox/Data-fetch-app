export const debounce = <F extends (...args: any[]) => void>(func: F, delay: number): F => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return ((...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    }) as F;
  };
  