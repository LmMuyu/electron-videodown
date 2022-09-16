export type MyReturnType<T extends (...arg: any) => any> = T extends (...arg: any) => infer R
  ? R
  : any;

export type MyTypeOne<T, K extends keyof T> = T[K];
