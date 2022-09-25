import { ipcReturnInfo, localVideoSavePath } from "./instance";
import { isDev } from "../../../main/utils/utils";
import connectSocket from "../../socket";
import { douyin } from "../../mongodb";
import { ipcMain } from "electron";
import { Stream } from "stream";
import { join } from "path";
import axios from "axios";
import fs from "fs";
import socket from "socket.io-client";
import { MyReturnType } from "../../../type/commom";

const douyinmethod = douyin();
let iostance: MyReturnType<typeof socket> | null = null;

ipcMain.handle("DownloadVideo", async (_channel, downloadinfo) => {
  const data = await axios({
    method: "post",
    url: "http://120.27.135.200:4000/downvideo/douyin/video",
    data: downloadinfo,
    adapter: require("axios/lib/adapters/http"),
  });

  try {
    if (data.status !== 200) {
      throw new Error("数据返回错误");
    }

    await startSaveStreamSocketVideo(data.data);
    return data.data;
  } catch (error) {
    console.log(error);
    return error;
  } finally {
    iostance && iostance.close();
  }
});

function startSaveStreamSocketVideo(videoinfo: ipcReturnInfo) {
  console.log(videoinfo);

  return new Promise((resolve, reject) => {
    iostance = connectSocket("120.27.135.200", "4000", async (s: Stream) => {
      const { savePath } = await localVideoSavePath(videoinfo.videoname);
      console.log(savePath);
      console.log(s);

      if (savePath) {
        const write = fs.createWriteStream(savePath);
        const sp = s.pipe(write);

        sp.addListener("drain", resolve);
        sp.addListener("finish", resolve);
        sp.addListener("error", reject);
        sp.addListener("unpipe", reject);
      } else {
        reject("视频储存地址为空");
      }
    });
  });
}

ipcMain[isDev() ? "handle" : "handleOnce"]("FindAllVideo", async () => {
  const dm = await douyinmethod;

  if (dm !== null) {
    return (await dm.findALL())?.map((value) =>
      Object.assign(value, {
        //@ts-ignore
        saveContextPath: join(process.cwd(), value.saveContextPath),
        //@ts-ignore
        savePath: join(process.cwd(), value.savePath),
      })
    );
  }

  return [];
});

export default {};
