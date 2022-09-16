export default function throttle(fn: Function, dealy: number) {
  let curnow = Date.now();

  return function _throttle(...arg: any) {
    const now = Date.now();

    if (now - curnow >= dealy) {
      fn.apply(null, arg);
      curnow = now;
    }
  };
}
