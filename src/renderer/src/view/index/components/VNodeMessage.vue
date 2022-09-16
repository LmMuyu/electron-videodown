<template>
  <div class="flex items-center">
    <el-icon class="is-loading">
      <Loading />
    </el-icon>
    <span class="text-el-primary">下载中</span>
    <div class="flex items-center">
      <div v-for="(point, index) in PointSum" :key="index">
        <span v-show="point" class="px-2">.</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import throttle from "../../../utils/throttle";
import { ElIcon } from "element-plus";

const LIMIT = 3;
const PointSum = new Array(LIMIT).fill(0).map(() => ref(false));
let rafStopIndex: number | null = null;
let sum = 1;
let cancel = false;
let preindex = Infinity;
let reset = false;

const _throttle = throttle((index: number) => {
  if (reset) PointSum.forEach((pointshowref) => (pointshowref.value = false));

  preindex = index;
  PointSum[index].value = true;
  reset = index === 2;
}, 500);

function raf() {
  sum += 1;

  const index = sum % LIMIT;

  if (index != preindex) {
    _throttle(index);
  }

  if (cancel) {
    cancelAnimationFrame(rafStopIndex as number);
    return;
  }

  rafStopIndex = requestAnimationFrame(raf);
}

raf();

onUnmounted(() => {
  console.log("onUnmounted");
  cancel = true;
});
</script>
<style scoped lang="scss"></style>
