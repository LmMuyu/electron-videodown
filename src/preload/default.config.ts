import path from "path";
import fse from "fs-extra";
import { isExists } from "../main/node/fs";

class Command {
  defaultVideoStorePath(filepath: string) {
    const dirpath = path.dirname(filepath);
    return path.resolve(dirpath);
  }
}

export function defaultConfigJson() {
  const defaultJsonPath = path.join(process.cwd(), "/default.config.json");
  const is = isExists(defaultJsonPath, "file");

  if (is) {
    return defaultJsonPath;
  } else {
    return undefined;
  }
}

export async function loadDefaultOptions() {
  const jsonPath = defaultConfigJson();
  if (!jsonPath) {
    return;
  }

  const defaultJsonData = await fse.readJson(jsonPath);
  return defaultJsonData;
}

export async function putDefaultJsonData(putpbj: Record<string, any>) {
  const jsondata = await loadDefaultOptions();

  for (const key in putpbj) {
    if (Object.prototype.hasOwnProperty.call(jsondata, key)) {
      const mutexCommand = new Command();
      jsondata[key] = mutexCommand[key] ?? mutexCommand[key](putpbj[key]);
    }
  }

  const writeJsonPath = defaultConfigJson();
  if (writeJsonPath) {
    await fse.writeJson(writeJsonPath, jsondata, {
      encoding: "utf-8",
    });
  }
}
