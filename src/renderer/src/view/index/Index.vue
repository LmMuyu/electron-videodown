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
          <div style="flex: 5" class="grid grid-cols-5 gap-2">
            <div v-for="(_, index) in 10" :key="index">
              <el-image
                class="h-32"
                src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
              />
              <div class="h-10"></div>
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

interface SelectOptionType {
  label: string;
  value: string;
}

const downLoadOps = reactive<{
  platform: string;
  SelectOptions: SelectOptionType[];
  AVSeparation: "1" | "2";
  link: string;
}>({
  platform: "抖音",
  SelectOptions: [],
  AVSeparation: "2",
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
      Object.assign({}, toRaw(downLoadOps), {
        AVSeparation: downLoadOps.AVSeparation === "1",
      })
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

async function AudioVideoSeparation() {
  downLoadOps.AVSeparation = downLoadOps.AVSeparation === "1" ? "2" : "1";
}
</script>
<style scoped lang="scss"></style>
