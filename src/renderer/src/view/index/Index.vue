<template>
  <ElContainer>
    <ElMain>
      <ElRow>
        <ElCol :span="6" class="flex items-center">
          <span class="text-el-primary font-bold whitespace-nowrap">平台：</span>
          <el-select v-model="downLoadOps.platform" class="m-2" placeholder="Select">
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
          <ElButton @click="downloadPlatformVideo" type="primary" class="px-7">下载</ElButton>
        </ElCol>
        <ElCol :span="3" class="flex items-center justify-center">
          <el-radio-group @click="AudioVideoSeparation" v-model="downLoadOps.AVSeparation">
            <el-radio :label="!downLoadOps.AVSeparation"> 音视频分离 </el-radio>
          </el-radio-group>
        </ElCol>
        <ElCol :span="2" class="flex items-center justify-center">
          <router-link to="" class="text-sm text-el-brand"> 下载设置 </router-link>
        </ElCol>
      </ElRow>
    </ElMain>
    <ElAside width="25vw" class="px-4">
      <div v-if="findDbVideo.lists.value.length > 0">
        <ElRow
          class="py-2"
          :align="'middle'"
          v-for="video in findDbVideo.lists.value"
          :key="video.vid"
          @click="toVideoDetail(video)"
        >
          <ElCol :span="4">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="icon-shipin"></use>
            </svg>
          </ElCol>
          <ElCol :span="20" class="flex flex-col">
            <span class="truncate text-el-primary text-sm">{{ video.videoname }}</span>
            <span class="py-2 text-xs from-neutral-400">{{ video.createtime }}</span>
          </ElCol>
        </ElRow>
      </div>
    </ElAside>
  </ElContainer>
</template>
<script setup lang="ts">
import { reactive, toRaw } from "vue";

import { FilpMessage, FindDbAllDownVideo } from ".";
import { videodetail } from "../videodetail/videodetail";

import {
  ElContainer,
  ElMain,
  ElAside,
  ElRow,
  ElCol,
  ElSelect,
  ElOption,
  ElInput,
  ElButton,
  ElRadioGroup,
  ElRadio,
} from "element-plus";
import { ipcReturnInfo } from "../../../../main/ipc/downloadvideo/instance";

interface SelectOptionType {
  label: string;
  value: string;
}

const downLoadOps = reactive<{
  platform: string;
  SelectOptions: SelectOptionType[];
  AVSeparation: boolean;
  link: string;
}>({
  platform: "抖音",
  SelectOptions: [],
  AVSeparation: false,
  link: "https://v.douyin.com/6DJkJQD/",
});

const findDbVideo = new FindDbAllDownVideo();

async function downloadPlatformVideo() {
  let timer = null;

  if (linkIsConform(downLoadOps.link.trim())) {
    const filpMess = new FilpMessage();

    filpMess.filp();

    //@ts-ignore
    const ipcMainDownVideoInfo = await window.api.ipcRenderer.invoke(
      "DownloadVideo",
      toRaw(downLoadOps)
    );

    //@ts-ignore
    timer = setTimeout(() => {
      filpMess.cancel();
      //@ts-ignore
      clearTimeout(timer);
      timer = null;
    }, 1000 * 30);

    const { info, type } = ipcMainDownVideoInfo;
    console.log(info);

    if (type !== "error") {
      findDbVideo.lists.value.push(info);
    } else {
    }
    filpMess.cancel();
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

function AudioVideoSeparation() {
  console.log(downLoadOps.AVSeparation);

  if (!downLoadOps.AVSeparation) {
    downLoadOps.AVSeparation = true;
  }
}
</script>
<style scoped lang="scss"></style>
