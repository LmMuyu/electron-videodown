export type MyReturnType<T extends (...arg: any) => any> = T extends (
  ...arg: any
) => infer R
  ? R
  : any;

export type MyTypeOne<T, K extends keyof T> = T[K];

export interface FFmpegArgs {
  originPath: string;
  psetartion: {
    whether: boolean;
    downlevel?: {
      noaudio?: boolean;
      novideo?: boolean;
    };
  };
  outVideo?: outputAudioOps;
  outAudio?: outputAudioOps;
}

interface outAVDetails {
  path?: string;
  outname?: string;
  format?: string;
  code?: string;
}

export type outputAudioOps = string | outAVDetails;

export type MyExclude<T extends Record<any, any>, U extends keyof T> = {
  [K in keyof T as Exclude<K, U>]: T[K];
};
