import { createReadStream, mkdirSync } from "fs";
import { isExists } from "../../node/fs";
import { join, resolve as pathResolve } from "path";
import * as path from "path";
import * as Ffmpeg from "fluent-ffmpeg";
import Fffmpeg from "fluent-ffmpeg";
import ayncPromise from "../../utils/ayncPromise";

import type { FFmpegArgs, MyReturnType } from "../../../type/commom";
import mittRealTime from "../mitt/realTimeRetPercent";
import { ipcMain } from "electron";

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
  // const len = p_s.push(ayncPromise());

  const noaudio = ff
    .videoCodec("libx264")
    .noAudio()
    .output(path.join(process.cwd(), "/data/ffmpegvideo"))
    .run();

  ff.on("progress", (progress) => {
    mittRealTime.pub("percent", progress.percent);
  });

  ff.on("error", (err) => {
    console.log(err);

    // p_s[len - 1].execute[1]({
    //   run() {
    //     console.log(err);
    //     return "分离视频失败";
    //   },
    // });
  });

  ff.on("end", () => {
    // p_s[len - 1].execute[0](true);
    console.log("完成");
  });
}

export async function SeparationAV(
  originPath: string,
  outVideoPath: string,
  outAudioPath: string,
  args: FFmpegArgs
) {
  await createOutputPathUpDir(outAudioPath, outVideoPath);

  return new Promise(async (resolve, reject) => {
    if (!args.psetartion.whether) {
      return;
    }

    console.log(originPath);

    // const exists = isExists(originPath, "file");

    // if (exists) {
    //   reject("文件不存在");
    //   return;
    // }

    const streamFile = createReadStream(pathResolve(originPath));

    const ff = Fffmpeg()
      .setFfmpegPath(ffmpegExePath)
      .input(streamFile)
      .on("data", (chunk) => {
        console.log(chunk);
      })
      .on("error", (err) => {
        console.log(err);
      })
      .noAudio()
      .videoCodec("libx264")
      .output(path.join(process.cwd(), "/data/ffmpegvideo"))
      .run();

    // const downlevel = args.psetartion.downlevel;

    // onlySliceVidio(ff, outVideoPath);

    // const onlySeparation = !downlevel?.noaudio && !downlevel?.novideo;

    // if (onlySeparation) {
    //   //  onlySliceAudio(ff, outAudioPath);
    // }

    // try {
    //   await Promise.all(p_s.map((p) => p._p));
    //   resolve(true);
    // } catch (error) {
    //   reject(error);
    // }
  });
}

async function createOutputPathUpDir(outAPath: string, outVPath: string) {
  const outADirQueue = path.dirname(outAPath).split(path.sep);
  const outVDirQueue = path.dirname(outVPath).split(path.sep);
  const rootPath = process.cwd();

  await queueExists(outADirQueue, rootPath);
  await queueExists(outVDirQueue, rootPath);

  return true;
}

async function queueExists(outputPaths: string[], outpath: string) {
  const outps = outputPaths.slice();

  let group = "";

  while (outps.length) {
    const joinPath = join(group, outps.shift()!);
    const path = join(outpath, joinPath);
    group = joinPath;

    const exists = isExists(path, "dir");

    if (!exists) {
      mkdirSync(path);
    }
  }

  return true;
}

export default function useIpcMainSeparationvideo() {
  const ops = {
    originPath: path.join(
      process.cwd(),
      "/data/video/朝鲜战争爆发后，美国为何迅速参战？ #历史  #朝鲜战争   #抗美援朝#历史大玩家  #奇妙知识在抖音.mp4"
    ),
    psetartion: {
      whether: true,
      downlevel: { noaudio: false, novideo: false },
    },
  };

  // 注册音视频分离ipc;
  ipcMain.handle("separationvideo", (_event, ffmpegargs: FFmpegArgs) => {
    SeparationAV(
      path.resolve("D:/codedir/electron-videodown/data/video/mmm.mp4"),
      "/data/video",
      "/data/audio",
      ops
    );
  });
}
