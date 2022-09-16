import { ipcMain } from "electron";
import { spawn } from "child_process";
import { join } from "path";

import { createIpcReturnInfo, ipcReturnInfo } from "./instance";
import { requestDouyinVideoInfo } from "./fetch";
import { douyin } from "../../mongodb";
import { isDev } from "../../../main/utils/utils";
import watchvideo from "./watchVideoDir";

const pyexe = join(process.cwd(), "/bin/抖音去水印/douyin.py");
const douyinmethod = douyin();

ipcMain.handle("DownloadVideo", async (_channel, downloadinfo) => {
  try {
    const videoinfo = await douyinStartDown(downloadinfo);

    return videoinfo;
  } catch (error) {
    console.log("有错误~");
    return error;
  }
});

function douyinStartDown(downloadinfo: any) {
  return new Promise(async (resolve, reject) => {
    let inwrite = false;
    let firstwatch = true;
    console.log("开始下载抖音视频");

    const stop = watchvideo(
      async (status: "add" | "addDir" | "change" | "unlink" | "unlinkDir") => {
        console.log("监听到文件添加");

        if (status === "add" && inwrite && firstwatch) {
          firstwatch = false;
          console.log("视频下载完成~");
          console.log("通过http请求，来请求视频信息后，来处理视频信息");
          const data = await transformData(downloadinfo.link);

          resolve({
            info: data,
            type: "success",
          });
        }
      }
    );

    const douyin = spawn("py", [pyexe], {
      cwd: join(process.cwd(), "/data/video"),
    });

    douyin.stdout.setEncoding("utf-8");

    douyin.stdout?.on("data", (_data) => writeStdin());
    douyin.stderr?.on("data", (err) => {
      console.log("失败\n\r");
      stop();
      douyin.disconnect;

      reject({
        info: err.toString(),
        type: "error",
      });
    });

    douyin.on("close", (code) => {
      console.log(`退出控制台：${code}`);
    });

    function writeStdin() {
      if (!inwrite) {
        douyin.stdin.write(downloadinfo.link, "utf-8", (err) => {
          console.log("已经将链接写入到子进程控制台");

          if (err) {
            console.log("视频链接地址输入错误");
            douyin.stdin.end();
            reject({
              info: err,
              type: "error",
            });
            return;
          }

          douyin.stdin.end();
          inwrite = true;
        });
      }
    }
  });
}

async function writeMongoDb(video: ipcReturnInfo) {
  const dm = await douyinmethod;
  if (dm !== null) {
    return await dm.insert(video);
  }
}

async function transformData(link: string) {
  console.log(1);

  const video = await requestDouyinVideoInfo(link);
  console.log(2);
  const vidoeInfo = await createIpcReturnInfo(video);
  console.log(3);
  const data = await writeMongoDb(vidoeInfo);
  console.log(4);
  console.log("数据返回完成");
  return Object.assign({}, vidoeInfo, data);
}

ipcMain[isDev() ? "handle" : "handleOnce"]("FindAllVideo", async () => {
  const dm = await douyinmethod;

  if (dm !== null) {
    return (await dm.findALL())?.map((value) =>
      Object.assign(value, {
        saveContextPath: join(process.cwd(), value.saveContextPath),
        savePath: join(process.cwd(), value.savePath),
      })
    );
  }

  return [];
});

export default {};
