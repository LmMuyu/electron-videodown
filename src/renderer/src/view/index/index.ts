import { ElMessage, MessageHandle } from "element-plus";
import { createVNode, Ref, ref } from "vue";
import VNodeMessage from "./components/VNodeMessage.vue";

import type { ipcReturnInfo } from "../../../../main/ipc/downloadvideo/instance";

export class FilpMessage {
  close: MessageHandle | undefined;

  filp() {
    this.close = ElMessage({
      message: createVNode(VNodeMessage),
      type: "info",
      duration: 0,
    });
  }

  cancel() {
    if (this.close) {
      this.close.close();
    }
  }
}

export class FindDbAllDownVideo {
  lists: Ref<ipcReturnInfo[]>;
  isfind: boolean;
  constructor() {
    this.lists = ref([]);
    this.ipcFindAll();
    this.isfind = false;
  }

  private async ipcFindAll() {
    if (this.isfind) return;
    //@ts-ignore
    const findall = await window.api.ipcRenderer.invoke("FindAllVideo");
    this.lists.value.push(...findall);
    this.isfind = true;
  }
}
