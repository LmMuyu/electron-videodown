<template>
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    closable
    @tab-click="tabclick"
    @tab-remove="removeTab"
  >
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
      :lazy="true"
    >
      <router-view v-if="item.name === editableTabsValue" v-slot="{ Component }">
        <transition
          enter-active-class="route_active"
          enter-from-class="route_from"
          enter-to-class="route_to"
          mode="out-in"
        >
          <suspense>
            <template #default>
              <component :is="Component" />
            </template>
            <template #fallback> Loading... </template>
          </suspense>
        </transition>
      </router-view>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
import { ElTabs, ElTabPane } from "element-plus";

import { ref } from "vue";
import { useRouter } from "vue-router";
import { videodetail } from "./view/videodetail/videodetail";

interface EditableTab {
  title: string;
  name: string;
  path: string;
}

let tabIndex = 1;
const router = useRouter();
const editableTabsValue = ref("1");
const editableTabs = ref<EditableTab[]>([
  {
    title: "主页",
    name: "1",
    path: "/index",
  },
]);
const piniavideodetail = videodetail();

piniavideodetail.$subscribe((mutaion) => {
  const isevents = Array.isArray(mutaion.events);
  if (!isevents) return;

  //@ts-ignore
  if (mutaion.events.type !== "delete" && mutaion.events[0].key === "videoinfo") {
    const videoname = (mutaion.events[0].newValue.videoname as string)
      .substring(0, 4)
      .padEnd(7, ".");

    const newTabName = addTab("/videodetail", videoname);
    piniavideodetail.selectTabVideoInfoSetMap(newTabName);
    router.push({ path: "/videodetail" });
  }
});

function addTab(topath: string, tabname: string) {
  const newTabName = `${++tabIndex}`;
  editableTabs.value.push({
    title: tabname,
    name: newTabName,
    path: topath,
  });

  editableTabsValue.value = newTabName;
  return newTabName;
}

const removeTab = (name: string) => {
  if (name === "1") return;

  const tabs = editableTabs.value;
  let activeName = editableTabsValue.value;

  //删除标签后的下一个标签
  if (activeName === name) {
    tabs.forEach((tab, index) => {
      if (tab.name === name) {
        piniavideodetail.removeMapInVideoInfo(tab.name);

        const nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) {
          activeName = nextTab.name;
          toPage(nextTab);
        }
      }
    });
  }

  editableTabsValue.value = activeName;
  editableTabs.value = tabs.filter((tab) => tab.name !== name);
};
function toPage(tab: EditableTab) {
  router.push({
    path: tab.path,
  });
}

function pagePath(name: string, path: string) {
  if (path === "/videodetail") {
    piniavideodetail.writeSelectTagMapToVideoInfo(name);
  }
}

function tabclick(e: any) {
  const Tab = editableTabs.value.find((tab) => tab.name === e.props.name)!;
  pagePath(Tab.name, Tab.path);
  toPage(Tab);
}
</script>
<style lang="scss">
.route_active {
  transition: all 0.25s ease-in;
}

.route_from {
  transform: translateY(-100px);
}

.route_to {
  transform: translateY(0px);
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
