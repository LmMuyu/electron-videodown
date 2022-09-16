import fs from "fs";
import path, { resolve } from "path";
import { promisify } from "util";

type ReadFileStatus = "success" | "error" | "noexist";
interface ReturnReadFileStatus {
  status: ReadFileStatus;
  data: string;
}

export function mkWinDir(dirPath: string) {
  return new Promise((resolve, reject) => {
    const dirpath = path.dirname(dirPath);

    fs.mkdir(dirpath, { recursive: true }, (err, path) => {
      if (err) return reject(err);
      resolve(path);
    });
  });
}

export function isExists(filepath: string, type: "dir" | "file") {
  const existsPath = type === "dir" ? path.dirname(filepath) : filepath;
  return fs.existsSync(existsPath) ? true : false;
}

export async function readFile(path: string): Promise<ReturnReadFileStatus> {
  const exist = isExists(path, "file");

  if (!exist)
    return {
      status: "noexist",
      data: "",
    };

  const proReadFile = promisify(fs.readFile);

  try {
    const data = await (await proReadFile(resolve(path))).toString();
    return {
      data,
      status: "success",
    };
  } catch (error) {
    return {
      data: JSON.stringify(error),
      status: "error",
    };
  }
}
