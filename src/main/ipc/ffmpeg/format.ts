import FTffmpeg from "fluent-ffmpeg";
import path from "path";
import { isExists, mkWinDir } from "../../node/fs";

const ffmpegExe = "D:/ffmpeg-5.0.1-essentials_build/bin/ffmpeg.exe";
const outputFile = path.join(process.cwd(), "/test/video/output.mp4");

export async function transformFormat(filename: string, filepath: string) {
  !isExists(outputFile, "dir") && (await mkWinDir(outputFile));

  return new Promise((resolve, reject) => {
    FTffmpeg()
      .setFfmpegPath(ffmpegExe)
      .addInput(filepath)
      .addOptions(["-y", "-ss 00:00:00", "-to 00:00:30", "-c copy"])
      .on("end", () => {
        resolve(outputFile);
      })
      .on("error", (err) => {
        console.log(err);

        reject(err);
      })
      .on("data", (chunk) => {
        console.log(chunk.toString());
      })
      .output(outputFile)
      .run();
  });
}
