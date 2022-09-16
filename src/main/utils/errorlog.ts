type errorStatus = "error" | "ok";

type channelData<T> = T extends File ? never : T extends HTMLElement ? never : T;

class errorClass {
  type: errorStatus;
  msg: any;
  constructor(type: errorStatus, msg: any) {
    this.type = type;
    this.msg = msg;
  }
}

export function errorlog<T>(type: errorStatus, msg: channelData<T>) {
  return new errorClass(type, msg);
}
