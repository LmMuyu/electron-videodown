import { join, dirname } from "path";
import { createWriteStream } from "fs";
import { readFile } from "../../node/fs";
import { defautlRenderer as defaultConfRendererJson } from "../../node/template";
import formatDate from "../../utils/formatDate";

import type { ipcDownvideoInfo } from "../../../type/ipc";

export class ipcReturnInfo implements ipcDownvideoInfo {
  vid: number;
  size: number;
  tags: { hashtag_id: number; hashtag_name: string }[];
  videoname: string;
  isdamaged: boolean;
  saveContextPath: string;
  savePath: string;
  originalAuthor: OriginalAuthor;
  music: Music;
  createtime: string;
  videoCover: string;

  constructor(data: any) {
    const videoinfo = data.item_list[0];

    this.vid = Number(videoinfo.aweme_id);
    this.videoname = videoinfo.desc;
    this.size = 2 << 19;
    this.isdamaged = false;
    this.saveContextPath = "";
    this.savePath = "";
    this.tags = (videoinfo.text_extra as Array<any>).map((extra) => ({
      hashtag_id: extra.hashtag_id,
      hashtag_name: extra.hashtag_name,
    }));
    this.createtime = formatDate(videoinfo.create_time * 1000);
    this.music = new Music(videoinfo.music);
    this.originalAuthor = new OriginalAuthor(videoinfo.author);
    this.videoCover = videoinfo.video.dynamic_cover.url_list[0];
  }
}

class OriginalAuthor {
  authorId: number;
  avatar: string;
  nickname: string;
  constructor(originauthor: any) {
    this.authorId = Number(originauthor.uid);
    this.avatar = originauthor.avatar_medium.url_list[0];
    this.nickname = originauthor.nickname;
  }
}

class Music {
  duration: number;
  mid: number | string;
  musicurl: string;
  constructor(music: any) {
    this.duration = music?.duration || 0;
    this.mid = music.mid;
    this.musicurl = music.play_url.url_list[0];
  }
}

function RestoringDefaultSettings(path: string) {
  return new Promise(async (resolve, reject) => {
    const write = createWriteStream(path, {
      flags: "a",
    });

    write.write(JSON.stringify(defaultConfRendererJson));

    write.on("finish", () => {
      write.close();
      resolve(true);
    });

    write.on("error", reject);

    resolve(true);
  });
}

export async function localVideoSavePath(filename: string) {
  try {
    const savePathConfJson = join(process.cwd(), "/src/conf/renderer.json");
    let status = await readFile(savePathConfJson);

    if (status.status === "noexist") {
      await RestoringDefaultSettings(savePathConfJson);
      status = await readFile(savePathConfJson);
    }

    const settingjson = new Function("return" + status.data)();

    const savePath = join(settingjson.savepath, filename) as string;
    const saveContextPath = dirname(savePath);

    return {
      saveContextPath,
      savePath,
    };
  } catch (error) {
    console.log(error);

    console.log("创建地址出错");
    return {};
  }
}

export async function createIpcReturnInfo(data: any) {
  const ipcinstance = new ipcReturnInfo(data);
  const pathsave = await localVideoSavePath(ipcinstance.videoname);

  return Object.assign(ipcinstance, pathsave);
}
