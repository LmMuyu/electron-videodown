export default function ayncPromise() {
  let execute = [];

  const _p = new Promise((resolve, rejects) => {
    execute.push(resolve, rejects);
  });

  return {
    execute,
    _p,
  };
}
