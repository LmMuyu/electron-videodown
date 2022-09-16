import { defineStore } from "pinia";
import { MyTypeOne } from "../../../../type/commom";
import type { ipcReturnInfo } from "../../../../main/ipc/downloadvideo/instance";

interface TabSelectOps {
  tabname: string;
  videoinfo: ipcReturnInfo;
}

interface State {
  videoinfo: ipcReturnInfo | null;
  vids: Set<MyTypeOne<ipcReturnInfo, "vid">>;
  tabSelectOps: Map<string, TabSelectOps>;
}

const videodetail = defineStore("videodetail", {
  state() {
    return {
      videoinfo: null,
      vids: new Set(),
      tabSelectOps: new Map(),
    } as State;
  },
  actions: {
    writeVideoInfo(videoinfo: MyTypeOne<State, "videoinfo">) {
      if (videoinfo && !this.vids.has(videoinfo.vid)) {
        this.videoinfo = videoinfo;
        this.vids.add(videoinfo.vid);
      }
    },
    selectTabVideoInfoSetMap(tabname: string) {
      this.tabSelectOps.set(tabname, {
        tabname,
        videoinfo: this.videoinfo as ipcReturnInfo,
      });
    },

    writeSelectTagMapToVideoInfo(tabname: string) {
      const videoinfoops = this.tabSelectOps.get(tabname)!;
      this.videoinfo = videoinfoops?.videoinfo;
    },

    removeMapInVideoInfo(tabname: string) {
    return  this.tabSelectOps.delete(tabname);
    },
  },
  getters: {
    readVideoInfo(state) {
      return state.videoinfo;
    },
  },
});

export { videodetail };
