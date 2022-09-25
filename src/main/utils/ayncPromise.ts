export default function ayncPromise() {
  let execute: any[] = [];

  const _p = new Promise((resolve, rejects) => {
    execute.push(resolve, rejects);
  });

  return {
    execute,
    _p,
  };
}
