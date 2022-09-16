import { createReadStream } from "fs";
import { isExists } from "../../node/fs";
import { join, resolve as pathResolve } from "path";
import Ffmpeg = require("fluent-ffmpeg");
import ayncPromise from "../../utils/ayncPromise";

import type { FFmpegArgs, MyReturnType } from "../../../type/commom";
import mittRealTime from "../mitt/realTimeRetPercent";

let p_s: MyReturnType<typeof ayncPromise>[] = [];

const ffmpegExePath = join(process.cwd(), "/bin/ffmpeg/bin/ffmpeg.exe");

function onlySliceAudio(ff: Ffmpeg.FfmpegCommand, outAudioPath: string) {
  const len = p_s.push(ayncPromise());

  ff.on("progress", (progress) => {
    mittRealTime.pub("percent", progress.percent);
  });

  const noaudio = ff.noVideo().audioCodec("copy").output(outAudioPath).run();

  ff.on("error", (err) => {
    p_s[len - 1].execute[1]({
      run() {
        console.log(err);
        return "分离音频失败";
      },
    });
  });

  ff.on("end", () => {
    p_s[len - 1].execute[0](true);
  });
}

function onlySliceVidio(ff: Ffmpeg.FfmpegCommand, oupVideoPath: string) {
  const len = p_s.push(ayncPromise());

  const noaudio = ff.noAudio().audioCodec("copy").output(oupVideoPath).run();

  ff.on("progress", (progress) => {
    mittRealTime.pub("percent", progress.percent);
  });

  ff.on("error", (err) => {
    p_s[len - 1].execute[1]({
      run() {
        console.log(err);
        return "分离视频失败";
      },
    });
  });

  ff.on("end", () => {
    p_s[len - 1].execute[0](true);
  });
}

export function SeparationAV(
  originPath: string,
  outVideoPath: string,
  outAudioPath: string,
  args: FFmpegArgs
) {
  return new Promise(async (resolve, reject) => {
    if (!args.psetartion.whether) {
      return;
    }

    const exists = isExists(originPath, "file");

    if (exists) {
      reject("文件不存在");
      return;
    }

    const streamFile = createReadStream(pathResolve(originPath));

    const ff = Ffmpeg.setFfmpegPath(ffmpegExePath).input(streamFile);

    const downlevel = args.psetartion.downlevel;

    const onlySeparation = !downlevel.noaudio && !downlevel.novideo;

    if (onlySeparation) {
      onlySliceAudio(ff, outAudioPath);
      onlySliceVidio(ff, outVideoPath);
    }

    try {
      await Promise.all(p_s.map((p) => p._p));
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}
