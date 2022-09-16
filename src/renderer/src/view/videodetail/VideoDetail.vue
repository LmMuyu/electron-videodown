<template>
  <ElContainer v-if="videoinfo !== null">
    <ElMain>
      <ElRow :align="'middle'">
        <ElCol :span="8" class="whitespace-nowrap flex items-center">
          <span>视频名：</span>
          <el-input v-model="videoReactive.videoname" placeholder="Please input" />
        </ElCol>
        <ElCol :span="8" class="whitespace-nowrap flex items-center">
          <span>地址：</span>
          <ElInput v-model="videoReactive.savePath" />
        </ElCol>
        <ElCol :span="8" class="whitespace-nowrap flex items-center">
          <span>标签：</span>
          <ElInput v-model="videoReactive.strtag" />
        </ElCol>
      </ElRow>
    </ElMain>
  </ElContainer>
</template>
<script setup lang="ts">
import { videodetail } from "./videodetail";
import { ElInput, ElContainer, ElMain, ElRow, ElCol } from "element-plus";
import { reactive } from "vue";

const piniavideodetail = videodetail();
const videoinfo = piniavideodetail.readVideoInfo;
console.log(videoinfo);

const strtag = videoinfo?.tags.reduce((strtag, tag) => (strtag += tag.hashtag_name + " "), "");

const videoReactive = reactive({
  strtag,
  videoname: videoinfo?.videoname,
  savePath: videoinfo?.savePath,
});
</script>
<style scoped lang="scss"></style>
