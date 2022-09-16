import { join } from "path";
import chokidar from "chokidar";

export default function watchvideo(
  callback: (evnetName: "add" | "addDir" | "change" | "unlink" | "unlinkDir") => void
) {
  console.log("监听文件");
  const videoDirPath = join(process.cwd(), "/data/video");

  const fswatch = chokidar.watch(videoDirPath, {
    depth: 0,
  });

  fswatch.on("all", callback);

  return async () => {
    console.log("取消监听");
    await fswatch.close();
    fswatch.unwatch(videoDirPath);
  };
}
