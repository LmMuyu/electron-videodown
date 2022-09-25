<template>
  <ElContainer>
    <ElMain class="h-full">
      <div class="flex items-center justify-center">
        <ElRow style="width: 75vw">
          <ElCol :span="6" class="flex items-center">
            <span class="text-el-primary font-bold whitespace-nowrap"
              >平台：</span
            >
            <el-select
              v-model="downLoadOps.platform"
              class="m-2"
              placeholder="Select"
            >
              <el-option
                v-for="item in downLoadOps.SelectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ElCol>
          <ElCol :span="10" class="flex items-center justify-center">
            <el-input v-model="downLoadOps.link" placeholder="输入连接" />
          </ElCol>
          <ElCol :span="3" class="flex justify-center items-center">
            <ElButton
              @click="downloadPlatformVideo"
              type="primary"
              class="px-7 text-el-brand"
              >下载</ElButton
            >
          </ElCol>
          <ElCol :span="3" class="flex items-center justify-center">
            <el-radio-group
              @click.stop.prevent="AudioVideoSeparation"
              v-model="downLoadOps.AVSeparation"
            >
              <el-radio label="1"> 音视频分离 </el-radio>
            </el-radio-group>
          </ElCol>
          <ElCol :span="2" class="flex items-center justify-center">
            <router-link to="" class="text-sm text-el-brand">
              下载设置
            </router-link>
          </ElCol>
        </ElRow>
      </div>

      <ElContainer class="transform-gpu translate-y-5">
        <ElMain class="flex">
          <div style="flex: 1"></div>
          <div
            style="flex: 5"
            class="grid grid-cols-5 gap-2"
            v-if="findDbVideo.lists.value.length > 0"
          >
            <div v-for="(video, index) in findDbVideo.lists.value" :key="index">
              <el-image class="w-full h-auto" :src="video.videoCover" />
              <div style="height: 15vh">
                <span class="truncate">{{ video.videoname }}</span>
              </div>
            </div>
          </div>
          <div style="flex: 1"></div>
        </ElMain>
      </ElContainer>
    </ElMain>
  </ElContainer>
</template>
<script setup lang="ts">
import { reactive, toRaw } from "vue";

import { FilpMessage, FindDbAllDownVideo } from ".";
import { videodetail } from "../videodetail/videodetail";

import {
  ElContainer,
  ElMain,
  ElRow,
  ElCol,
  ElSelect,
  ElOption,
  ElInput,
  ElButton,
  ElRadioGroup,
  ElRadio,
  ElImage,
} from "element-plus";
import { ipcReturnInfo } from "../../../../main/ipc/downloadvideo/instance";
// import f from "../../components/NotableWind.vue";

import type { FFmpegArgs, MyExclude } from "../../../../type/commom";

interface SelectOptionType {
  label: string;
  value: string;
}

const downLoadOps = reactive<{
  platform: string;
  SelectOptions: SelectOptionType[];
  AVSeparation: "1" | "2";
  link: string;
  FFmpegArgs: MyExclude<FFmpegArgs, "originPath">;
}>({
  platform: "抖音",
  SelectOptions: [],
  AVSeparation: "2",
  //ffmpeg配置
  FFmpegArgs: {
    psetartion: {
      whether: false,
      downlevel: {
        noaudio: false,
        novideo: false,
      },
    },
  },
  link: "https://v.douyin.com/6DJkJQD/",
});

const findDbVideo = new FindDbAllDownVideo();

async function downloadPlatformVideo() {
  let timer = null;

  if (linkIsConform(downLoadOps.link.trim())) {
    const filpMess = new FilpMessage();
    const LaestCloseTime = 2000;

    const filpTime = Date.now();
    filpMess.filp();

    //最大限制下载视频
    //@ts-ignore
    timer = setTimeout(() => {
      filpMess.cancel();
      timer && clearTimeout(timer);
      timer = null;
    }, 1000 * 30);

    const ipcMainDownVideoInfo: {
      info: ipcReturnInfo;
      type: "success" | "error";
      //@ts-ignore
    } = await window.api.ipcRenderer.invoke(
      "DownloadVideo",
      Object.assign({}, toRaw(downLoadOps))
    );

    const { info, type } = ipcMainDownVideoInfo;

    if (type !== "error") {
      findDbVideo.lists.value.push(info);
    } else {
      console.log(info);
    }

    const diffTime = Date.now() - filpTime;

    if (diffTime > LaestCloseTime) {
      filpMess.cancel();
    } else {
      //@ts-ignore
      timer = setTimeout(() => {
        filpMess.cancel();
        timer && clearTimeout(timer);
        timer = null;
      }, LaestCloseTime);
    }

    //是否分离音视频
    if (downLoadOps.AVSeparation === "1" && type !== "error") {
      ffmpegSeparationVideo(info.savePath);
    }
  }
}

function linkIsConform(link: string) {
  if (link) {
    return link.match(/^https?/) === null ? false : true;
  }

  return false;
}

function toVideoDetail(videoinfo: ipcReturnInfo) {
  const piniaVideo = videodetail();
  piniaVideo.$patch({
    videoinfo,
  });
}

async function AudioVideoSeparation() {
  downLoadOps.AVSeparation = downLoadOps.AVSeparation === "1" ? "2" : "1";
}

async function ffmpegSeparationVideo(originPath: string) {
  const FFmpegArgs = {
    originPath,
    psetartion: Object.assign(toRaw(downLoadOps.FFmpegArgs.psetartion), {
      whether: true,
    }),
  } as FFmpegArgs;

  //@ts-ignore
  const savepath = await window.api.ipcRenderer.invoke(
    "separationvideo",
    FFmpegArgs
  );
}
</script>
<style scoped lang="scss"></style>
